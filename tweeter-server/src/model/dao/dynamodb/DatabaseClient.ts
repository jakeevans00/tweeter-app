import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class AwsDynamoDb {
  private static instance: DynamoDBDocumentClient;
  private constructor() {}
  public static getClient() {
    if (!AwsDynamoDb.instance) {
      AwsDynamoDb.instance = DynamoDBDocumentClient.from(new DynamoDBClient());
    }
    return AwsDynamoDb.instance;
  }
}
