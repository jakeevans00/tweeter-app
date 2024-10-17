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
      const [user, authToken] = await this.service.login(alias, password);
      this.view.updateUserInfo(user, user, authToken, rememberMe);
    }, "/");
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
