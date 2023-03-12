// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
import * as DynamoDB from "aws-sdk/clients/dynamodb";
import {Logger} from "@aws-lambda-powertools/logger";
import {
  AuditableEntity,
  Pageable,
  Page,
} from "./models";

const logger = new Logger();

// Todo: Make Decorator for Errors

export class CrudRepository<T extends AuditableEntity> {
  private documentClient: DynamoDB.DocumentClient;
  private tableName:      string;

  constructor(tableName: string, options?: DynamoDB.Types.ClientConfiguration) {
    const https = require("https");
    const agent = new https.Agent({ keepAlive: true });
    this.documentClient = new DynamoDB.DocumentClient({ ...options, region: "eu-west-1", httpOptions: { agent } });
    this.tableName      = tableName;
  }

  /**
   * Todo:
   * Scan  cannot return sorted results (based on Sort-Key)
   * Query need to be used for that, i.e. => query(indexName, pkey=<>, skey is-in <>, pageable) => Search Opportunities by Category
   * @param pageable 
   */
  async findAll(pageable: Pageable<T>): Promise<Page<T>> {
    const params: DynamoDB.DocumentClient.ScanInput = {
      ExclusiveStartKey: pageable.nextKey,
      Limit:             pageable.limit,
      TableName:         this.tableName,
    };
    try {
      const scanned =
        await this.documentClient
        .scan(params)
        .promise();
      return {
        lastKey: scanned["LastEvaluatedKey"] as Partial<T>,
        items:   scanned["Items"] as T[],
      };
    } catch (error) {
      logger.error(JSON.stringify(error))
      throw error;
    }
  }

  /**
   * Puts a single item into Table by delegating to AWS.DynamoDB.DocumentClient.put().
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
      logger.error(JSON.stringify(error))
      throw error;
    }
  }

  /**
   * Gets a single item from Table by delegating to AWS.DynamoDB.DocumentClient.get().
   * @param keys
   */
  async get(keys: Partial<T>): Promise<T | undefined> {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: keys,
    };
    try {
      const  item = await this.documentClient.get(params).promise();
      return item.Item as T;
    } catch (error) {
      logger.error(JSON.stringify(error))
      throw error;
    }
  }

  /**
   * Updates a single item from Table by delegating to AWS.DynamoDB.DocumentClient.update().
   * @param keys
   * @param item
   */
  async update(keys: Partial<T>, item: Partial<T>): Promise<void> {
    const itemKeys = Object.keys(item);
    const itemKey0 = itemKeys[0];
    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: keys,
      ConditionExpression: Object.keys(keys).map((key) => `attribute_exists(${key})`).join(" and "),
      UpdateExpression: `set #${itemKey0} = :${itemKey0}`,
      ExpressionAttributeNames:  { [`#${itemKey0}`]: itemKey0 },
      // @ts-ignore
      ExpressionAttributeValues: { [`:${itemKey0}`]: item[itemKey0] },
    };
    itemKeys.splice(1).forEach((itemKeyX) => {
      params.UpdateExpression += `, #${itemKeyX} = :${itemKeyX}`;
      params.ExpressionAttributeNames ![`#${itemKeyX}`] = itemKeyX;
      // @ts-ignore
      params.ExpressionAttributeValues![`:${itemKeyX}`] = item[itemKeyX];
    });
    try {
      await this.documentClient.update(params).promise();
    } catch (error) {
      logger.error(JSON.stringify(error))
      throw error;
    }
  }

  /**
   * Deletes a single item from Table by delegating to AWS.DynamoDB.DocumentClient.delete().
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
      logger.error(JSON.stringify(error))
      throw error;
    }
  }
}

// To test

// type Affe = AuditableEntity & {id: number}

// const repository = new CrudRepository<Affe>("Affe");

// (async () => {
//   for (let id = 0; id < 10; id++) {
//     await new Promise(resolve => setTimeout(resolve, 2000))
//     let ts = new Date().toISOString();
//     repository.put({
//       id,
//       createdAt: ts,
//       updatedAt: ts,
//     });
//   }
//   let nextKey;
//   do {
//     const result: Page<Affe> = await repository.findAll({nextKey, limit: 2});
//     console.debug(JSON.stringify(result));
//     nextKey = result.lastKey;
//   }
//   while (nextKey != undefined)
// })();
