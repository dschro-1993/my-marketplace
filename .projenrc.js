const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'marketplace',

  deps: [
    '@aws-lambda-powertools/tracer',
    '@aws-lambda-powertools/metrics',
    '@aws-lambda-powertools/logger',
    '@types/aws-lambda',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-appsync',
    '@aws-cdk/aws-dynamodb',
    '@aws-sdk/client-dynamodb',
    'aws-sdk',
    '@middy/core',
    'graphql',
    'uuid',
    'graphql-codegen-typescript-common',
  ],
  devDeps: [
    '@graphql-codegen/introspection',
    '@graphql-codegen/cli',
    '@graphql-codegen/typescript',
    '@graphql-codegen/typescript-operations',
    '@graphql-codegen/typescript-resolvers',
    'typescript',
  ],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.setScript('codegen', 'graphql-codegen --config codegen.ts'),

project.synth();