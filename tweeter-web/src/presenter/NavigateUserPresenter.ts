import { AuthToken, FindUserRequest, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface NavigateUserView extends View {
  setDisplayedUser: (value: User) => void;
}

export class NavigateUserPresenter extends Presenter<NavigateUserView> {
  private userService = new UserService();

  constructor(view: NavigateUserView) {
    super(view);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    const getUserRequest: FindUserRequest = {
      token: authToken.token,
      userAlias: "",
      userToFind: alias,
    };
    return this.userService.findUserByAlias(getUserRequest);
  }

  public async navigateToUser(
    authToken: AuthToken,
    currentUser: User,
    eventTarget: string
  ) {
    super.tryOperation(async () => {
      const alias = this.extractAlias(eventTarget);
      const user = await this.getUser(authToken!, alias);
      if (user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
