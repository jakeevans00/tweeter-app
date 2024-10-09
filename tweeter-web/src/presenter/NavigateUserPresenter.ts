import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface NavigateUserView {
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string) => void;
}

export class NavigateUserPresenter {
  private userService = new UserService();
  private view;

  constructor(view: NavigateUserView) {
    this.view = view;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return this.userService.findUserByAlias(alias);
  }

  public async navigateToUser(
    authToken: AuthToken,
    currentUser: User,
    eventTarget: string
  ) {
    try {
      const alias = this.extractAlias(eventTarget);
      const user = await this.getUser(authToken!, alias);
      if (user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
