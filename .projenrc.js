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
    '@types/aws-sdk',
    'aws-sdk',
    '@middy/core',
  ],
  // eslintOptions: {
  //   dirs: [
  //     'src',
  //     'next',
  //     'graphql',
  //   ],
  // },

  // tsconfig: {
  //   include: [
  //     'next/**/*.ts',
  //     'graphql/**/*.ts',
  //   ],
  // },
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();