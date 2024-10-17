import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService = new StatusService();
  private _isLoading = false;

  constructor(view: PostStatusView) {
    super(view);
  }

  public get isLoading() {
    return this._isLoading;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    super.tryOperation(
      async () => {
        this._isLoading = true;
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        await this.statusService.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage();
        this._isLoading = false;
      }
    );
  }

  public async clearPost() {
    super.tryOperation(async () => {
      this.view.setPost("");
    }, "clear status");
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken,
    currentUser: User
  ) {
    return !post.trim() || !authToken || !currentUser;
  }
}
