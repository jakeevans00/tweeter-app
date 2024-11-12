import {
  User,
  AuthToken,
  TweeterRequest,
  IsFollowerRequest,
} from "tweeter-shared";
import { ClientService } from "./ClientService";
import { PagedUserItemRequest } from "tweeter-shared";
export class FollowService extends ClientService {
  public async loadMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowees(request);
  }

  public async getFolloweeCount(request: TweeterRequest): Promise<number> {
    return this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(request: TweeterRequest): Promise<number> {
    return this.serverFacade.getFollowerCount(request);
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    return this.serverFacade.getIsFollowerStatus(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    const followerCountRequest: TweeterRequest = {
      token: authToken.token,
      userAlias: userToFollow.alias,
    };
    const followeeCountRequest: TweeterRequest = {
      token: authToken.token,
      userAlias: userToFollow.alias,
    };

    const followerCount = await this.getFollowerCount(followerCountRequest);
    const followeeCount = await this.getFolloweeCount(followeeCountRequest);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    const followeeCountRequest: TweeterRequest = {
      token: authToken.token,
      userAlias: userToUnfollow.alias,
    };

    const followerCountRequest: TweeterRequest = {
      token: authToken.token,
      userAlias: userToUnfollow.alias,
    };

    const followerCount = await this.getFollowerCount(followerCountRequest);
    const followeeCount = await this.getFolloweeCount(followeeCountRequest);

    return [followerCount, followeeCount];
  }
}
