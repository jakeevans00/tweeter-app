import { StatusDto } from "tweeter-shared";
import { FeedDao } from "../FeedDao";
import { AwsDynamoDb } from "./DatabaseClient";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { parseStatusItems } from "./DynamoUtils";

export class DynamoDbFeedDao implements FeedDao {
  private readonly tableName = "feeds";
  private readonly receiverAttr = "receiver_alias";
  private readonly authorAttr = "author_alias";
  private readonly postSegmentsAttr = "post_segments";
  private readonly authorFirstNameAttr = "author_first_name";
  private readonly authorLastNameAttr = "author_last_name";
  private readonly authorImageUrl = "author_image_url";

  async putFeed(receiverAlias: string, status: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.receiverAttr]: receiverAlias,
        timestamp: new Date().getTime(),
        [this.authorAttr]: status?.user?.alias,
        post: status.post,
        [this.postSegmentsAttr]: status.postSegments,
        [this.authorFirstNameAttr]: status?.user?.firstName,
        [this.authorLastNameAttr]: status?.user?.lastName,
        [this.authorImageUrl]: status?.user?.imageUrl,
      },
    };

    await AwsDynamoDb.getClient().send(new PutCommand(params));
  }

  async getFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.receiverAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": userAlias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem !== null
          ? {
              [this.receiverAttr]: userAlias,
              timestamp: lastItem?.timestamp,
            }
          : undefined,
    };
    const data = await AwsDynamoDb.getClient().send(new QueryCommand(params));
    return parseStatusItems(data);
  }
}
