import { StatusDto, UserDto } from "tweeter-shared";
import { StoryDao } from "../StoryDao";
import { AwsDynamoDb } from "./DatabaseClient";
import {
  PutCommand,
  QueryCommand,
  QueryCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export class DynamoDbStoryDao implements StoryDao {
  private readonly tableName = "stories";
  private readonly authorAttr = "author_alias";
  private readonly postSegmentsAttr = "post_segments";
  private readonly authorFirstNameAttr = "author_first_name";
  private readonly authorLastNameAttr = "author_last_name";
  private readonly authorImageUrl = "author_image_url";

  async putStatus(status: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.authorAttr]: status?.user?.alias,
        timestamp: new Date().getTime(),
        post: status.post,
        [this.postSegmentsAttr]: status.postSegments,
        [this.authorFirstNameAttr]: status?.user?.firstName,
        [this.authorLastNameAttr]: status?.user?.lastName,
        [this.authorImageUrl]: status?.user?.imageUrl,
      },
    };

    await AwsDynamoDb.getClient().send(new PutCommand(params));
  }

  async getStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.authorAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": userAlias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem !== null
          ? {
              [this.authorAttr]: userAlias,
              timestamp: lastItem?.timestamp,
            }
          : undefined,
    };
    const data = await AwsDynamoDb.getClient().send(new QueryCommand(params));
    return this.parseStatusItems(data);
  }

  private parseStatusItems(data: QueryCommandOutput): [StatusDto[], boolean] {
    const items: StatusDto[] = [];

    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => {
      const userDto: UserDto = {
        firstName: item.author_first_name,
        lastName: item.author_last_name,
        alias: item.author_alias,
        imageUrl: item.author_image_url,
      };
      const statusDto: StatusDto = {
        post: item.post,
        user: userDto,
        timestamp: item.timestamp,
        postSegments: item.post_segments,
      };
      items.push(statusDto);
    });
    return [items, hasMorePages];
  }
}
