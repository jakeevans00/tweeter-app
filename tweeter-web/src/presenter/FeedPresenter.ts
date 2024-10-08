import { AuthToken } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
  private _statusService = new StatusService();

  constructor(view: StatusItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, alias: string) {
    try {
      const [newItems, hasMore] = await this._statusService.loadMoreFeed(
        authToken!,
        alias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load Feed items because of exception: ${error}`
      );
    }
  }
}
