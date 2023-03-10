import { DynamoDbDataSource, GraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface DynamoDBProps {
  api: GraphqlApi;
}

export class DynamoDataSource extends Construct {

  private api: GraphqlApi;

  public readonly opportunitiesDS: DynamoDbDataSource;
  public readonly usersDS: DynamoDbDataSource;

  public readonly opportunitiesTable: Table;
  public readonly usersTable: Table;

  constructor(scope: Construct, id: string, props: DynamoDBProps) {
    super(scope, id);

    const { api } = props;
    this.api = api;

    this.opportunitiesTable = new Table(this, 'OpportunitiesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'name',
        type: AttributeType.STRING,
      },
      tableName: 'OpportunitiesTable',
    });
    this.opportunitiesDS = this.api.addDynamoDbDataSource('OpportunitiesDataSource', this.opportunitiesTable);

    this.usersTable = new Table(this, 'UsersTable', {
      partitionKey: {
        name: 'email',
        type: AttributeType.STRING,
      },
      tableName: 'UsersTable',
    });
    this.usersDS = this.api.addDynamoDbDataSource('UsersDataSource', this.usersTable);
  }
}