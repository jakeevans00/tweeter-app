import { SessionDao } from "../SessionDao";
import { v4 as uuid } from "uuid";
import { AwsDynamoDb } from "./DatabaseClient";
import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDto } from "tweeter-shared";

export class DynamoDbSessionDao implements SessionDao {
  private readonly tableName = "sessions";
  private readonly tokenAttr = "authtoken";
  private readonly userAliasAttr = "user_alias";

  async createSession(userAlias: string): Promise<AuthTokenDto> {
    const token = this.generateToken();
    const timestamp = new Date().getTime();

    const params = {
      TableName: this.tableName,
      Item: {
        [this.tokenAttr]: token,
        timestamp,
        [this.userAliasAttr]: userAlias,
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
    };

    await AwsDynamoDb.getClient().send(new PutCommand(params));

    return { token, timestamp };
  }

  async deleteSession(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateSessionItem(token),
    };

    await AwsDynamoDb.getClient().send(new DeleteCommand(params));
  }

  private generateToken(): string {
    return uuid();
  }

  private generateSessionItem(token: string) {
    return {
      [this.tokenAttr]: token,
    };
  }
}
