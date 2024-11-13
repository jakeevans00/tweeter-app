import {
  User,
  TweeterRequest,
  IsFollowerRequest,
  FollowUserRequest,
  UnfollowUserRequest,
  UserDto,
} from "tweeter-shared";
import { ClientService } from "./ClientService";
import { PagedItemRequest } from "tweeter-shared";
export class FollowService extends ClientService {
  public async loadMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    request: PagedItemRequest<UserDto>
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
    request: FollowUserRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.follow(request);
  }

  public async unfollow(
    request: UnfollowUserRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.unfollow(request);
  }
}
