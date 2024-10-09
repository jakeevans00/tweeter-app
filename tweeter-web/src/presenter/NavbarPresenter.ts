import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface NavbarView {
  clearUserInfo: () => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  displayErrorMessage: (message: string) => void;
}

export class NavbarPresenter {
  private view;
  private userService = new UserService();

  constructor(view: NavbarView) {
    this.view = view;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
