import { AuthToken, PagedItemRequest, Status, StatusDto } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[Status[], boolean]> {
    const getStoryRequest: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias,
      pageSize: PAGE_SIZE,
      lastItem: this.lastItem?.dto ?? null,
    };
    return this.service.loadMoreFeed(getStoryRequest);
  }
  protected getItemDescription(): string {
    return "load Feed items";
  }
}
