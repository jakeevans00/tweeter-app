import { AuthToken, User, PagedItemRequest, UserDto } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDto> = {
      token: authToken.token,
      userAlias,
      pageSize: PAGE_SIZE,
      lastItem: this.lastItem?.dto ?? null,
    };
    return this.service.loadMoreFollowers(request);
  }
  protected getItemDescription(): string {
    return "load followers";
  }
}
