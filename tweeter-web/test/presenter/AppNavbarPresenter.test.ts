import { AuthToken, TweeterRequest } from "tweeter-shared";
import {
  NavbarPresenter,
  NavbarView,
} from "../../src/presenter/NavbarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockNavbarView: NavbarView;
  let navbarPresenter: NavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc123", Date.now());
  const logoutRequest: TweeterRequest = {
    token: authToken.token,
    userAlias: "",
  };

  beforeEach(() => {
    mockNavbarView = mock<NavbarView>();
    const mockNavbarViewInstance = instance(mockNavbarView);

    const spiedNavbarPresenter = spy(
      new NavbarPresenter(mockNavbarViewInstance)
    );

    navbarPresenter = instance(spiedNavbarPresenter);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(spiedNavbarPresenter.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await navbarPresenter.logout(authToken);
    verify(mockNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await navbarPresenter.logout(authToken);
    const [capturedRequest] = capture(mockUserService.logout).last();
    expect(capturedRequest.token).toEqual(authToken.token);
  });

  it("tells the view to clear the last info message and clear the user info on logout success", async () => {
    await navbarPresenter.logout(authToken);
    verify(mockNavbarView.clearLastInfoMessage()).once();
    verify(mockNavbarView.clearUserInfo()).once();
  });

  it("tells the view to display an error message but does not tell it to clear the last info message \
     or clear the user info on unsuccessful logout", async () => {
    const error = new Error("an error occured");
    when(mockUserService.logout(anything())).thenThrow(error);

    await navbarPresenter.logout(authToken);
    verify(mockNavbarView.displayErrorMessage(anything())).once();
    verify(mockNavbarView.clearLastInfoMessage()).never();
    verify(mockNavbarView.clearUserInfo()).never();
  });
});
