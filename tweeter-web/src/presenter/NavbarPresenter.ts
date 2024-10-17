import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface NavbarView extends MessageView {
  clearUserInfo: () => void;
}

export class NavbarPresenter extends Presenter<NavbarView> {
  private userService = new UserService();

  constructor(view: NavbarView) {
    super(view);
  }

  public async logOut(authToken: AuthToken) {
    super.tryOperation(async () => {
      this.view.displayInfoMessage("Logging Out...", 0);
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      super.view.clearUserInfo();
    }, "log user out");
  }
}
