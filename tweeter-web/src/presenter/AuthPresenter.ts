import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

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

export class AuthPresenter extends Presenter<AuthView> {
  private _isLoading = false;

  constructor(view: AuthView) {
    super(view);
  }

  public get isLoading() {
    return this._isLoading;
  }
}
