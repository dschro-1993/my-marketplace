import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GraphQLBackend } from './appsync-backend/main';

export class MyStack extends Stack {

  public readonly api: GraphQLBackend;

  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    this.api = new GraphQLBackend(this, 'GraphQLBackend');
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'marketplace-dev', { env: devEnv });
// new MyStack(app, 'marketplace-prod', { env: prodEnv });

app.synth();