import path from 'path';
import { CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import { AuthorizationType, GraphqlApi, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { LayerVersion, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { DynamoDataSource } from './dynamo';

const commonHandlerProps: Partial<NodejsFunctionProps> = {
  runtime: Runtime.NODEJS_18_X,
  tracing: Tracing.ACTIVE,
  timeout: Duration.seconds(10),
  logRetention: RetentionDays.ONE_DAY,
  environment: {
    NODE_OPTIONS: '--enable-source-maps', // see https://docs.aws.amazon.com/lambda/latest/dg/typescript-exceptions.html
    POWERTOOLS_SERVICE_NAME: 'items-store',
    POWERTOOLS_METRICS_NAMESPACE: 'PowertoolsCDKExample',
    LOG_LEVEL: 'DEBUG',
  },
  bundling: {
    externalModules: [
      '@aws-sdk/lib-dynamodb',
      '@aws-sdk/client-dynamodb',
      '@aws-lambda-powertools/commons',
      '@aws-lambda-powertools/logger',
      '@aws-lambda-powertools/tracer',
      '@aws-lambda-powertools/metrics',
    ],
  },
  layers: [],
};

export class GraphQLBackend extends Construct {

  public readonly api: GraphqlApi;
  public readonly dynamoDS: DynamoDataSource;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.api = this.createApi();

    this.dynamoDS = new DynamoDataSource(this, 'DynamoDataSource', {
      api: this.api,
    });

    this.setupPowerTools();
    this.opportunitiesHandler();
  }

  createApi = () => {
    const api = new GraphqlApi(this, 'Api', {
      name: 'cdk-appsync-backend',
      schema: SchemaFile.fromAsset(path.join(__dirname, 'schema', 'schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.IAM,
        },
      },
      xrayEnabled: true,
    });

    new CfnOutput(this, 'GraphQLAPIURL', {
      value: this.api.graphqlUrl,
    });

    return api;
  };

  setupPowerTools = () => {
    commonHandlerProps.layers?.push(
      LayerVersion.fromLayerVersionArn(
        this,
        'powertools-layer',
        `arn:aws:lambda:${Stack.of(this).region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:6`),
    );
  };

  opportunitiesHandler = () => {
    const handler = new NodejsFunction(this, 'opportunitiesHandler', {
      ...commonHandlerProps,
      entry: path.join(__dirname, 'lambda', 'opportunity.ts'),
      environment: {
        TABLE_NAME: this.dynamoDS.opportunitiesTable.tableName,
      },
    });

    this.dynamoDS.opportunitiesTable.grantReadData(handler);
    this.dynamoDS.opportunitiesTable.grantWriteData(handler);

    this.api.addLambdaDataSource('getOpportunities', handler);
    this.api.addLambdaDataSource('updateOpportunity', handler);
    this.api.addLambdaDataSource('createOpportunity', handler);
    this.api.addLambdaDataSource('deleteOpportunity', handler);

  };
}