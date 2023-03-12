import path from 'path';
import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AuthorizationType, GraphqlApi, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { DatabaseCluster, DatabaseSecret } from 'aws-cdk-lib/aws-docdb';
import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { apiConfig, commonHandlerProps, documentDBConfig, isDev, vpcConfig } from './constants';


interface LambdaResolverProps {
  name: string;
  entry: string;
  queries: string[];
  mutations: string[];
}

export class ServerlessMarketplaceStack extends Stack {

  private readonly api: GraphqlApi;
  private readonly vpc: Vpc;
  private readonly documentDb: DatabaseCluster;
  private readonly documentDbCredentials: DatabaseSecret;
  private readonly documentDbKmsKey: Key;

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    this.vpc = this.createVpc();
    const { documentDb, kmsKey, userCredentials } = this.createDocumentDb();
    this.documentDbCredentials = userCredentials;
    this.documentDb = documentDb;
    this.documentDbKmsKey = kmsKey;
    this.api = this.createApi();
    this.setupPowerTools();
    this.setupLambdaResolvers();
  }

  /**
   * Create VPC with public and data subnet.
   * @returns {Vpc}
   */
  createVpc = () => {

    const maxAzs = isDev ? 2 : 3;
    const natGateways = isDev ? 1 : 2;

    return new Vpc(this, 'Vpc', {
      maxAzs: maxAzs,
      natGateways: natGateways,
      cidr: vpcConfig.cidr,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: vpcConfig.subnetMask,
        },
        {
          name: 'data',
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: vpcConfig.subnetMask,
        },
      ],
    });
  };

  /**
   * Create Document Db in VPC data subnet
   * @returns {DatabaseCluster}
   */
  createDocumentDb = () => {

    const { userName, secretName, excludedCharacters } = documentDBConfig;

    const vpc = this.vpc;
    const documentDb = new DatabaseCluster(this, 'DocumentDbCluster', {
      masterUser: {
        username: 'powersniper123',
        excludeCharacters: excludedCharacters,
      },
      instanceType: InstanceType.of(InstanceClass.R5, InstanceSize.LARGE),
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      vpc,
    });

    // create KMS key to encrypt user credentials
    const kmsKey = new Key(this, 'DocumentDbKmsKey', {
      enableKeyRotation: true,
    });

    // create user to access Document Db
    const userCredentials = new DatabaseSecret(this, 'DocumentDbSecret', {
      username: userName,
      secretName: secretName,
      masterSecret: documentDb.secret!,
      encryptionKey: kmsKey,
      excludeCharacters: excludedCharacters,
    });

    // attach user credentials to Document Db
    const attachedCredentials = userCredentials.attach(documentDb);

    // rotate secret automatically every 30 days
    documentDb.addRotationMultiUser('DocumentDbSecretRotation', {
      secret: attachedCredentials,
    });

    return {
      documentDb,
      userCredentials,
      kmsKey,
    };
  };

  /**
   * Create Appsync Graphql API
   * @returns {GraphqlApi}
   */
  createApi = () => {
    const api = new GraphqlApi(this, 'Api', {
      name: apiConfig.name,
      schema: SchemaFile.fromAsset(path.join(__dirname, '..', 'schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.IAM,
        },
      },
      xrayEnabled: true,
    });

    new CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    });

    return api;
  };

  /**
   * Create Lambda Layer required by the AWS Lambda Powertools
   */
  setupPowerTools = () => {
    commonHandlerProps.layers?.push(
      LayerVersion.fromLayerVersionArn(
        this,
        'powertools-layer',
        `arn:aws:lambda:${Stack.of(this).region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:6`),
    );
  };

  /**
   * Create Lambda Functions for all graphql resolvers
   */
  setupLambdaResolvers = () => {
    this.createLambdaForResolvers({
      name: 'opportunitiesHandler',
      entry: path.join(__dirname, 'graphql', 'opportunity', 'handler.ts'),
      queries: ['getOpportunities'],
      mutations: ['updateOpportunity', 'createOpportunity', 'deleteOpportunity'],
    });
  };

  /**
   * Create a lambda NodejsFunction that contains graphql resolver logic
   * for all queries and mutations of a REST resource.
   *
   * Registers the lambda function as a resolver for all queries and mutations passed.
   *
   * @param name name of the lambda function
   * @param entry path to the lambda function
   * @param queries list of queries to register the lambda function as a resolver for
   * @param mutations list of mutations to register the lambda function as a resolver for
   */
  createLambdaForResolvers = ({ name, entry, queries, mutations } : LambdaResolverProps) => {

    // create lambda function
    // lambda execution role will be created automatically
    // @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html#role
    const handler = new NodejsFunction(this, name, {
      // configures powertools for lambda
      ...commonHandlerProps,
      entry: entry,
    });

    // supply environment variables to reach documentDb
    handler.addEnvironment('DOCUMENT_DB_WRITE_ENDPOINT', this.documentDb.clusterEndpoint.socketAddress);
    handler.addEnvironment('DOCUMENT_DB_READ_ENDPOINT', this.documentDb.clusterReadEndpoint.socketAddress);
    handler.addEnvironment('DOCUMENT_DB_SECRET_NAME', this.documentDbCredentials.secretName);

    // add queries to api
    queries.forEach((query) => {
      this.api.addLambdaDataSource(query, handler);
    });

    // add mutations to api
    mutations.forEach((mutation) => {
      this.api.addLambdaDataSource(mutation, handler);
    });

    // allow lambda to access the documentDB KMS key to decrypt the cluster secret
    handler.addToRolePolicy(
      new PolicyStatement({
        actions: ['kms:Decrypt'],
        resources: [this.documentDbKmsKey.keyArn],
      }),
    );

    // give lambda access to documentDb user credentials secret in secret manager
    this.documentDbCredentials.grantRead(handler);

    // give lambda acces to documentDb default port
    this.documentDb.connections.allowDefaultPortTo(handler);
  };
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new ServerlessMarketplaceStack(app, 'marketplace-dev', { env: devEnv });
// new MyStack(app, 'marketplace-prod', { env: prodEnv });

app.synth();