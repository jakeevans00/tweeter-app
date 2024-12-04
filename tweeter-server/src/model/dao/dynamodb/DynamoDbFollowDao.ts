import { Follow, User, UserDto } from "tweeter-shared";
import { FollowDao } from "../FollowDao";
import { FollowDBItem } from "../../service/FollowService";
import { AwsDynamoDb } from "./DatabaseClient";
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export class DynamoDbFollowDao implements FollowDao {
  private readonly tableName = "follows";
  private readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followeeHandleAttr = "followee_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeNameAttr = "followee_name";

  async getFollows(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowsItem(userAlias, selectedUserAlias),
    };
    const result = await AwsDynamoDb.getClient().send(new GetCommand(params));
    return result.Item !== undefined;
  }

  async putFollow(follow: FollowDBItem): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerHandleAttr]: follow.followerHandle,
        [this.followerNameAttr]: follow.followerName,
        [this.followeeHandleAttr]: follow.followeeHandle,
        [this.followeeNameAttr]: follow.followeeName,
      },
    };
    await AwsDynamoDb.getClient().send(new PutCommand(params));
  }
  async deleteFollow(userAlias: string, userToUnfollow: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerHandleAttr]: userAlias,
        [this.followeeHandleAttr]: userToUnfollow,
      },
    };
    await AwsDynamoDb.getClient().send(new DeleteCommand(params));
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<[UserDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle !== undefined
          ? {
              [this.followerHandleAttr]: followerHandle,
              [this.followeeHandleAttr]: lastFolloweeHandle,
            }
          : undefined,
    };
    const data = await AwsDynamoDb.getClient().send(new QueryCommand(params));
    return this.parseFollowItems(data, "followees");
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[UserDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.followeeHandleAttr + " = :f",
      ExpressionAttributeValues: {
        ":f": followeeHandle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle !== undefined
          ? {
              [this.followerHandleAttr]: lastFollowerHandle,
              [this.followeeHandleAttr]: followeeHandle,
            }
          : undefined,
    };
    const data = await AwsDynamoDb.getClient().send(new QueryCommand(params));
    return this.parseFollowItems(data, "followers");
  }

  private parseFollowItems(
    data: QueryCommandOutput,
    type: "followers" | "followees"
  ): [UserDto[], boolean] {
    const items: UserDto[] = [];
    const hasMorePages = data.LastEvaluatedKey !== undefined;

    data.Items?.forEach((item) => {
      const handle =
        type === "followers"
          ? item[this.followerHandleAttr]
          : item[this.followeeHandleAttr];

      const name =
        type === "followers"
          ? item[this.followerNameAttr]
          : item[this.followeeNameAttr];
      const [firstName, lastName] = name.split(" ");
      items.push({
        firstName,
        lastName,
        alias: handle,
        imageUrl: "",
      });
    });
    return [items, hasMorePages];
  }

  private generateFollowsItem(followerHandle: string, followeeHandle: string) {
    return {
      [this.followerHandleAttr]: followerHandle,
      [this.followeeHandleAttr]: followeeHandle,
    };
  }
}
