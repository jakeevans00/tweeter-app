import { User, UserDto } from "tweeter-shared";
import { UserDao } from "../UserDao";
import { AwsDynamoDb } from "./DatabaseClient";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { UserDBItem } from "../../service/UserService";

interface UserDBRecord {
  first_name: string;
  last_name: string;
  user_alias: string;
  password: string;
  image_url: string;
}

export class DynamoDbUserDao implements UserDao {
  readonly tableName = "users";
  readonly firstNameAttr = "first_name";
  readonly lastNameAttr = "last_name";
  readonly userAlias = "user_alias";
  readonly password = "password";
  readonly imageUrl = "image_url";

  async getUser(alias: string): Promise<UserDBItem | null> {
    const params = {
      TableName: this.tableName,
      Key: { [this.userAlias]: alias },
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

  private toDBRecord(user: UserDBItem): UserDBRecord {
    return {
      first_name: user.firstName,
      last_name: user.lastName,
      user_alias: user.alias,
      password: user.password,
      image_url: user.imageUrl,
    };
  }

  private fromDBRecord(user: UserDBRecord): UserDBItem {
    return {
      firstName: user.first_name,
      lastName: user.last_name,
      alias: user.user_alias,
      password: user.password,
      imageUrl: user.image_url,
    };
  }
}
