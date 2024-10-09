import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  setPost: (post: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter {
  private view;
  private statusService = new StatusService();
  private _isLoading = false;

  constructor(view: PostStatusView) {
    this.view = view;
  }

  public get isLoading() {
    return this._isLoading;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    try {
      this._isLoading = true;
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this._isLoading = false;
    }
  }

  public async clearPost() {
    try {
      this.view.setPost("");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to clear status because of exception ${error}`
      );
    }
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken,
    currentUser: User
  ) {
    return !post.trim() || !authToken || !currentUser;
  }
}
