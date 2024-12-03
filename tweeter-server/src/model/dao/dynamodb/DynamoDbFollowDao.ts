import { Follow, User } from "tweeter-shared";
import { FollowDao } from "../FollowDao";

export class DynamoDbFollowDao implements FollowDao {
  putFollow(follow: Follow): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteFollow(follow: Follow): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getIsFollower(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getFollowerCount(token: string, userAlias: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getFolloweeCount(token: string, userAlias: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<[User[], boolean]> {
    throw new Error("Method not implemented.");
  }
  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[User[], boolean]> {
    throw new Error("Method not implemented.");
  }
}
