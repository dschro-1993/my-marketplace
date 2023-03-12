import { Duration } from 'aws-cdk-lib';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export const isDev = process.env.NODE_ENV === 'development';

export const documentDBConfig = {
  userName: process.env.DOCUMENT_DB_USERNAME || 'myuser',
  secretName: process.env.DOCUMENT_DB_SECRET_NAME || 'documentDbSecret',
  excludedCharacters: process.env.DOCUMENT_DB_EXCLUDED_CHARACTERS || '\"@/:',
};

export const commonHandlerProps: Partial<NodejsFunctionProps> = {
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

export const apiConfig = {
  name: process.env.API_NAME || 'graphql-api',
};

export const vpcConfig = {
  cidr: process.env.VPC_CIDR || '10.0.0.5/16',
  subnetMask: parseInt(process.env.VPC_SUBNET_MASK || '24'),
};