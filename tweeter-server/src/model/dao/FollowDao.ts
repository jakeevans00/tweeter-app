import { User, Follow } from "tweeter-shared";

export interface FollowDao {
  putFollow(follow: Follow): Promise<void>;
  deleteFollow(follow: Follow): Promise<void>;

  getIsFollower(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean>;

  getFollowerCount(token: string, userAlias: string): Promise<number>;
  getFolloweeCount(token: string, userAlias: string): Promise<number>;

  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<[User[], boolean]>;

  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[User[], boolean]>;
}
