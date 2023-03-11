import https from 'https';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import { Entity } from './entity';

export class CrudRepository<T extends Entity> {
  private documentClient: DynamoDB.DocumentClient;
  private tableName: string;

  constructor(tableName: string, options?: DynamoDB.Types.ClientConfiguration) {
    const agent = new https.Agent({ keepAlive: true });
    this.documentClient = new DynamoDB.DocumentClient({ ...options, httpOptions: { agent } });
    this.tableName = tableName;
  }

  /**
   * Puts a single item with the given primary key by delegating to AWS.DynamoDB.DocumentClient.put().
   * @param item
   */
  async put(item: T): Promise<void> {
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: item,
    };
    try {
      await this.documentClient.put(params).promise();
    } catch (error) {
      console.error(error); // Todo
      throw error;
    }
  }

  /**
   * Gets a single item with the given primary key by delegating to AWS.DynamoDB.DocumentClient.get().
   * @param keys
   */
  async get(keys: Partial<T>): Promise<T | undefined> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: keys,
    };
    try {
      const item = await this.documentClient.get(params).promise();
      return item.Item as T;
    } catch (error) {
      console.error(error); // Todo
      throw error;
    }
  }

  /**
   * Return all items in the table by delegating to AWS.DynamoDB.DocumentClient.scan().
   * @returns {Promise<T[]>}
   */
  async scan(): Promise<T[]> { // TODO: We can't implement pagination here, what is the alternative?
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName,
    };
    try {
      const items = await this.documentClient.scan(params).promise();
      return items.Items as T[];
    } catch (error) {
      console.error(error); // Todo
      throw error;
    }
  }

  /**
   * Updates a single item with the given primary key by delegating to AWS.DynamoDB.DocumentClient.update().
   * @param keys
   * @param item
   */
  async update(keys: Partial<T>, item: Partial<T>): Promise<void> {
    const itemKeys = Object.keys(item);
    const itemKey0 = itemKeys[0];
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: keys,
      ConditionExpression: Object.keys(keys).map((key) => `attribute_exists(${key})`).join(' and '),
      UpdateExpression: `set #${itemKey0} = :${itemKey0}`,
      ExpressionAttributeNames: { [`#${itemKey0}`]: itemKey0 },
      ExpressionAttributeValues: { [`:${itemKey0}`]: item[itemKey0] },
    };
    itemKeys.splice(1).forEach((itemKeyX) => {
      params.UpdateExpression += `, #${itemKeyX} = :${itemKeyX}`;
      params.ExpressionAttributeNames ![`#${itemKeyX}`] = itemKeyX;
      params.ExpressionAttributeValues![`:${itemKeyX}`] = item[itemKeyX];
    });
    try {
      await this.documentClient.update(params).promise();
    } catch (error) {
      console.error(error); // Todo
      throw error;
    }
  }

  /**
   * Deletes a single item with the given primary key by delegating to AWS.DynamoDB.DocumentClient.delete().
   * @param keys
   */
  async delete(keys: Partial<T>): Promise<void> {
    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: keys,
    };
    try {
      await this.documentClient.delete(params).promise();
    } catch (error) {
      console.error(error); // Todo
      throw error;
    }
  }
}