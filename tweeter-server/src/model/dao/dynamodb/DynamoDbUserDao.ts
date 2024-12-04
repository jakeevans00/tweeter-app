import { User, UserDto } from "tweeter-shared";
import { UserDao } from "../UserDao";
import { AwsDynamoDb } from "./DatabaseClient";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { UserDBItem } from "../../service/UserService";

interface UserDBRecord {
  first_name: string;
  last_name: string;
  user_alias: string;
  password: string;
  image_url: string;
  followee_count: number;
  follower_count: number;
}

export class DynamoDbUserDao implements UserDao {
  readonly tableName = "users";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly userAliasAttr = "user_alias";
  readonly passwordAttr = "password";
  readonly imageUrlAttr = "image_url";
  readonly followeeCountAttr = "followee_count";
  readonly followerCountAttr = "follower_count";

  async getUser(alias: string): Promise<UserDBItem | null> {
    const params = {
      TableName: this.tableName,
      Key: { [this.userAliasAttr]: alias },
    };

    const result = await AwsDynamoDb.getClient().send(new GetCommand(params));
    if (!result.Item) {
      return null;
    }

    const user = result.Item;

    return {
      firstName: user?.first_name,
      lastName: user?.last_name,
      alias: user?.user_alias,
      password: user?.password,
      imageUrl: user?.image_url,
      followerCount: user?.follower_count,
      followeeCount: user?.followee_count,
    };
  }

  async putUser(user: UserDBItem): Promise<UserDBItem | null> {
    const dbRecord = this.toDBRecord(user);
    const params = {
      TableName: this.tableName,
      Item: dbRecord,
    };

    await AwsDynamoDb.getClient().send(new PutCommand(params));
    return this.fromDBRecord(params.Item);
  }

  async getFollowerCount(token: string, userAlias: string): Promise<number> {
    const user = await this.getUser(userAlias);
    return user!.followerCount;
  }
  async getFolloweeCount(token: string, userAlias: string): Promise<number> {
    const user = await this.getUser(userAlias);
    return user!.followeeCount;
  }

  async updateUserCount(
    token: string,
    userAlias: string,
    countType: "follower" | "followee",
    increase: boolean
  ): Promise<void> {
    const attributeName =
      countType === "follower"
        ? this.followerCountAttr
        : this.followeeCountAttr;
    const increment = increase ? 1 : -1;

    const params = {
      TableName: this.tableName,
      Key: { [this.userAliasAttr]: userAlias },
      ExpressionAttributeValues: { ":inc": increment },
      UpdateExpression:
        "SET " + attributeName + " = " + attributeName + " + :inc",
    };
    await AwsDynamoDb.getClient().send(new UpdateCommand(params));
  }

  private toDBRecord(user: UserDBItem): UserDBRecord {
    return {
      first_name: user.firstName,
      last_name: user.lastName,
      user_alias: user.alias,
      password: user.password,
      image_url: user.imageUrl,
      followee_count: user.followeeCount,
      follower_count: user.followerCount,
    };
  }

  private fromDBRecord(user: UserDBRecord): UserDBItem {
    return {
      firstName: user.first_name,
      lastName: user.last_name,
      alias: user.user_alias,
      password: user.password,
      imageUrl: user.image_url,
      followeeCount: user.followee_count,
      followerCount: user.follower_count,
    };
  }
}
