import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserDto,
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

  private async getMoreItems(
    request: PagedUserItemRequest,
    endpoint: string,
    itemDesc: string
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, endpoint);

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No ${itemDesc} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "An error occurred");
    }
  }
}
