import { UserDto } from "tweeter-shared";
import { FollowDBItem } from "../service/FollowService";

export interface FollowDao {
  putFollow(follow: FollowDBItem): Promise<void>;
  deleteFollow(userAlias: string, userToUnfollow: string): Promise<void>;

  getFollows(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean>;

  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<[UserDto[], boolean]>;

  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[UserDto[], boolean]>;
}
