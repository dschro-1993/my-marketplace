import path from 'path';
import { App, CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { AuthorizationType, GraphqlApi, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { LayerVersion, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';


export const OPPORTUNITIES_TABLE_NAME = 'OpportunitiesTable';
export const USERS_TABLE_NAME = 'UsersTable';

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

interface Tables {
  opportunitiesTable: Table;
  usersTable: Table;
}

export class ServerlessMarketplaceStack extends Stack {

  private readonly api: GraphqlApi;
  private readonly tables: Tables;

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    this.api = this.createApi();
    this.tables = this.createTables(this.api);
    this.setupPowerTools();
    this.setupLambdaResolvers(this.tables);
  }

  createApi = () => {
    const api = new GraphqlApi(this, 'Api', {
      name: 'cdk-appsync-backend',
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

  setupPowerTools = () => {
    commonHandlerProps.layers?.push(
      LayerVersion.fromLayerVersionArn(
        this,
        'powertools-layer',
        `arn:aws:lambda:${Stack.of(this).region}:094274105915:layer:AWSLambdaPowertoolsTypeScript:6`),
    );
  };

  setupLambdaResolvers = (tables: Tables) => {
    const handler = new NodejsFunction(this, 'opportunitiesHandler', {
      ...commonHandlerProps,
      entry: path.join(__dirname, 'graphql', 'opportunity', 'handler.ts'),
    });

    tables.opportunitiesTable.grantReadWriteData(handler);

    this.api.addLambdaDataSource('getOpportunities', handler);
    this.api.addLambdaDataSource('updateOpportunity', handler);
    this.api.addLambdaDataSource('createOpportunity', handler);
    this.api.addLambdaDataSource('deleteOpportunity', handler);
  };

  createTables = (api: GraphqlApi): Tables => {

    const opportunitiesTable = new Table(this, 'OpportunitiesTable', {
      partitionKey: {
        name: 'id', // id = uuid
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'ca', // ca = createdAt
        type: AttributeType.STRING,
      },
      tableName: OPPORTUNITIES_TABLE_NAME,
    });
    api.addDynamoDbDataSource('OpportunitiesDataSource', opportunitiesTable);

    const usersTable = new Table(this, 'UsersTable', {
      partitionKey: {
        name: 'id', // id = uuid
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'ea', // ea = email address
        type: AttributeType.STRING,
      },
      tableName: USERS_TABLE_NAME,
    });
    api.addDynamoDbDataSource('UsersDataSource', usersTable);

    return {
      opportunitiesTable,
      usersTable,
    };
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