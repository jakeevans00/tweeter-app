import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthView extends View {
  navigate: (url: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export abstract class AuthPresenter extends Presenter<AuthView> {
  private _isLoading = false;
  protected service = new UserService();

  constructor(view: AuthView) {
    super(view);
  }

  public get isLoading() {
    return this._isLoading;
  }

  protected async authenticate(doAuthenticate: () => void, navigateTo: string) {
    super.tryOperation(
      async () => {
        this.view.setIsLoading(true);
        doAuthenticate();
      },
      this.getAuthDescription(),
      () => {
        this.view.navigate(navigateTo);
        this.view.setIsLoading(false);
      }
    );
  }

  protected abstract getAuthDescription(): string;
}
