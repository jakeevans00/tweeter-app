import {
  AuthResponse,
  AuthToken,
  FindUserRequest,
  FollowCountsResponse,
  FolloweeCountResponse,
  FollowerCountResponse,
  FollowUserRequest,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterRequest,
  TweeterResponse,
  UnfollowUserRequest,
  User,
  UserDto,
  UserResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://pmhfprmo6c.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  private userFactory = new UserFactory();
  private statusFactory = new StatusFactory();

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return this.getMoreItems<UserDto, User>(
      this.userFactory,
      request,
      "/followee/list",
      "followees"
    );
  }

  public async getMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return this.getMoreItems(
      this.userFactory,
      request,
      "/follower/list",
      "followers"
    );
  }

  public async getFolloweeCount(request: TweeterRequest): Promise<number> {
    return this.makeRequest(
      request,
      "/followee/count",
      (response: FolloweeCountResponse) => response.followeeCount
    );
  }

  public async getFollowerCount(request: TweeterRequest): Promise<number> {
    return this.makeRequest(
      request,
      "/follower/count",
      (response: FollowerCountResponse) => response.followerCount
    );
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    return this.makeRequest(
      request,
      "/follower/isFollower",
      (response: IsFollowerResponse) => response.isFollower
    );
  }

  public async follow(
    request: FollowUserRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.doFollowOperation<FollowUserRequest>(
      request,
      "/followee/follow"
    );
  }

  public async unfollow(
    request: UnfollowUserRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.doFollowOperation<UnfollowUserRequest>(
      request,
      "/followee/unfollow"
    );
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    return this.makeRequest(request, "/status/post", () => {});
  }

  public async getMoreFeed(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.getMoreItems(
      this.statusFactory,
      request,
      "/status/feed",
      "feed"
    );
  }

  public async getMoreStory(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.getMoreItems(
      this.statusFactory,
      request,
      "/status/story",
      "story"
    );
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    return this.makeAuthRequest(request, "/user/login");
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    return this.makeAuthRequest(request, "/user/register");
  }

  public async logout(request: TweeterRequest): Promise<void> {
    return this.makeRequest(request, "/user/logout", () => {});
  }

  public async findUserByAlias(request: FindUserRequest): Promise<User | null> {
    return this.makeRequest(request, "/user/find", (response: UserResponse) =>
      User.fromDto(response.user)
    );
  }

  private doFollowOperation<T extends FollowUserRequest | UnfollowUserRequest>(
    request: T,
    endpoint: string
  ) {
    return this.makeRequest(
      request,
      endpoint,
      (response: FollowCountsResponse): FollowCounts => [
        response.followerCount,
        response.followeeCount,
      ]
    );
  }

  private async makeAuthRequest<R extends TweeterRequest>(
    request: R,
    endpoint: string
  ): Promise<[User, AuthToken]> {
    return this.makeRequest(request, endpoint, (response: AuthResponse) => {
      const user = User.fromDto(response.user);
      const authToken = AuthToken.fromDto(response.authToken);
      if (!user || !authToken) {
        console.log("broken in auth request");
        throw new Error(`Unable to login`);
      }
      return [user, authToken];
    });
  }

  private async getMoreItems<TDto extends Dto, TEntity extends Entity>(
    factory: DomainFactory<TDto, TEntity>,
    request: PagedItemRequest<TDto>,
    endpoint: string,
    itemDesc: string
  ): Promise<[TEntity[], boolean]> {
    return this.makeRequest(
      request,
      endpoint,
      (response: PagedItemResponse<TDto>) => {
        const items: TEntity[] | null =
          response.success && response.items
            ? response.items.map((dto) => factory.fromDto(dto) as TEntity)
            : null;

        if (!items) {
          throw new Error(`No ${itemDesc} found`);
        }
        return [items, response.hasMore];
      }
    );
  }

  private async makeRequest<
    TRequest extends TweeterRequest,
    TReponse extends TweeterResponse,
    TResult
  >(
    request: TRequest,
    endpoint: string,
    extractData: (response: TReponse) => TResult
  ): Promise<TResult> {
    const response = await this.clientCommunicator.doPost<TRequest, TReponse>(
      request,
      endpoint
    );
    return this.handleResponse(response, extractData);
  }

  private async handleResponse<T extends TweeterResponse, R>(
    response: T,
    extractData: (response: T) => R
  ): Promise<R> {
    if (response.success) {
      return extractData(response);
    } else {
      console.error(response);
      throw new Error(response.message || "An error occured");
    }
  }
}
type Entity = Status | User;
type Dto = StatusDto | UserDto;

interface DomainFactory<TDto extends Dto, TEntity extends Entity> {
  create(): TEntity;
  fromDto(dto: TDto | null): TEntity | null;
}

class UserFactory implements DomainFactory<UserDto, User> {
  create(): User {
    return new User("first", "last", "@test", "url");
  }
  fromDto(dto: UserDto | null): User | null {
    return User.fromDto(dto);
  }
}

class StatusFactory implements DomainFactory<StatusDto, Status> {
  create(): Status {
    return new Status("post", new User("first", "last", "alias", "url"), 0);
  }
  fromDto(dto: StatusDto | null): Status | null {
    return Status.fromDto(dto);
  }
}

type FollowCounts = [followerCount: number, followeeCount: number];
