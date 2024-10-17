import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {
  private userService = new UserService();

  constructor(view: AuthView) {
    super(view);
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
    super.tryOperation(
      async () => {
        this.view.setIsLoading(true);
        const [user, authToken] = await this.userService.login(alias, password);

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate("/");
        }
      },
      "log user",
      () => {
        this.view.setIsLoading(false);
      }
    );
  }

  public checkSubmitButtonStatus = (
    alias: string,
    password: string
  ): boolean => {
    return !alias || !password;
  };
}
