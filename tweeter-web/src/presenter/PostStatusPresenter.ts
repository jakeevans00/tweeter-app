import { AuthToken, PostStatusRequest, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;
  private _isLoading = false;

  constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get isLoading() {
    return this._isLoading;
  }

  public get statusService() {
    return this._statusService;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    super.tryOperation(
      async () => {
        this._isLoading = true;
        this.view.clearLastInfoMessage();
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        const postStatusRequest: PostStatusRequest = {
          token: authToken.token,
          userAlias: currentUser.alias,
          newStatus: status.dto,
        };
        await this.statusService.postStatus(postStatusRequest);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
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
