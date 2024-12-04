import { UserDto } from "tweeter-shared";
import { UserDBItem } from "../service/UserService";

export interface UserDao {
  getUser(alias: string): Promise<UserDBItem | null>;
  putUser(user: UserDBItem): Promise<UserDto | null>;

  getFollowerCount(token: string, userAlias: string): Promise<number>;
  getFolloweeCount(token: string, userAlias: string): Promise<number>;
  updateUserCount(
    token: string,
    userAlias: string,
    countType: string,
    increase: boolean
  ): Promise<void>;
}
