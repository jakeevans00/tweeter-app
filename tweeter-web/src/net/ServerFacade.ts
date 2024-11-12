import {
  FolloweeCountResponse,
  FollowerCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  TweeterRequest,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://pmhfprmo6c.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.getMoreItems(request, "/followee/list", "followees");
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.getMoreItems(request, "/follower/list", "followers");
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

  private async getMoreItems(
    request: PagedUserItemRequest,
    endpoint: string,
    itemDesc: string
  ): Promise<[User[], boolean]> {
    return this.makeRequest(
      request,
      endpoint,
      (response: PagedUserItemResponse) => {
        const items: User[] | null =
          response.success && response.items
            ? response.items.map((dto) => User.fromDto(dto) as User)
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
