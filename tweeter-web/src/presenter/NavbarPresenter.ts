import { AuthToken, TweeterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface NavbarView extends MessageView {
  clearUserInfo: () => void;
}

export class NavbarPresenter extends Presenter<NavbarView> {
  private _userService: UserService;

  constructor(view: NavbarView) {
    super(view);
    this._userService = new UserService();
  }

  public get userService() {
    return this._userService;
  }

  public async logout(authToken: AuthToken) {
    super.tryOperation(async () => {
      this.view.displayInfoMessage("Logging Out...", 0);
      const logoutRequest: TweeterRequest = {
        token: authToken.token,
        userAlias: "",
      };
      await this.userService.logout(logoutRequest);

      this.view.clearLastInfoMessage();
      super.view.clearUserInfo();
    }, "log user out");
  }
}
