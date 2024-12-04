import { LoginRequest } from "tweeter-shared";
import { AuthPresenter } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {
  protected getAuthDescription(): string {
    return "login user";
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ): Promise<void> {
    if (this.checkSubmitButtonStatus(alias, password)) {
      return;
    }
    super.authenticate(async () => {
      const loginRequest: LoginRequest = {
        token: "",
        userAlias: alias,
        password: password,
      };
      const [user, authToken] = await this.service.login(loginRequest);
      console.log(user.alias, user.firstName);
      this.view.updateUserInfo(user, user, authToken, rememberMe);
    }, this.determineUrl(originalUrl));
  }

  private determineUrl(originalUrl: string | undefined) {
    return originalUrl || "/";
  }
  public checkSubmitButtonStatus = (
    alias: string,
    password: string
  ): boolean => {
    return !alias || !password;
  };
}
