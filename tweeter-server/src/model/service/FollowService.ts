import { User, FakeData, UserDto, Follow } from "tweeter-shared";
import { UserDao } from "../dao/UserDao";
import { FollowDao } from "../dao/FollowDao";
import { AwsDaoFactory } from "../factory/AwsDaoFactory";

export interface FollowDBItem {
  followerHandle: string;
  followerName: string;
  followerImageUrl: string;
  followeeHandle: string;
  followeeName: string;
  followeeImageUrl: string;
}
export class FollowService {
  private userDao: UserDao;
  private followDao: FollowDao;

  constructor() {
    this.userDao = AwsDaoFactory.getInstance().getUserDao();
    this.followDao = AwsDaoFactory.getInstance().getFollowDao();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.followDao.getPageOfFollowers(
      userAlias,
      pageSize,
      lastItem?.alias
    );
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.followDao.getPageOfFollowees(
      userAlias,
      pageSize,
      lastItem?.alias
    );
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    return await this.userDao.getFolloweeCount(token, userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    return await this.userDao.getFollowerCount(token, userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    return this.followDao.getFollows(token, userAlias, selectedUserAlias);
  }

  public async follow(
    token: string,
    userAlias: string,
    userToFollow: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const [currentUserDto, userToFollowDto] = await Promise.all([
      this.userDao.getUser(userAlias),
      this.userDao.getUser(userToFollow),
    ]);

    const followDBItem: FollowDBItem = {
      followerHandle: currentUserDto!.alias,
      followerName: `${currentUserDto?.firstName} ${currentUserDto?.lastName}`,
      followerImageUrl: currentUserDto!.imageUrl,
      followeeHandle: userToFollowDto!.alias,
      followeeName: `${userToFollowDto?.firstName} ${userToFollowDto?.lastName}`,
      followeeImageUrl: userToFollowDto!.imageUrl,
    };
    await this.followDao.putFollow(followDBItem);

    await this.userDao.updateUserCount(token, userAlias, "followee", true);
    await this.userDao.updateUserCount(token, userToFollow, "follower", true);

    return [userToFollowDto!.followerCount + 1, userToFollowDto!.followeeCount];
  }

  public async unfollow(
    token: string,
    userAlias: string,
    userToUnfollow: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.followDao.deleteFollow(userAlias, userToUnfollow);

    await this.userDao.updateUserCount(token, userAlias, "followee", false);
    await this.userDao.updateUserCount(
      token,
      userToUnfollow,
      "follower",
      false
    );
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }
}
