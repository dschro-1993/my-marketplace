const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'marketplace',

  deps: [
    'mongodb',
    '@aws-lambda-powertools/tracer',
    '@aws-lambda-powertools/metrics',
    '@aws-lambda-powertools/logger',
    '@types/aws-lambda',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-appsync',
    '@aws-cdk/aws-dynamodb',
    '@middy/core',
  ],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'dotenv'
  ],
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();