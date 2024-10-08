import { User, AuthToken } from "tweeter-shared";

export interface AuthView {
  navigate: (url: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class AuthPresenter {
  private _view;
  private _isLoading = false;

  constructor(view: AuthView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  public get isLoading() {
    return this._isLoading;
  }
}
