import PostStatus from "../../../src/components/postStatus/PostStatus";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";
import { instance, mock, verify } from "ts-mockito";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUserInstance = new User("User", "Pass", "alias", "url");
  const mockAuthTokenInstance = new AuthToken("token", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });
  it("has both post status and clear buttons disabled on first render", () => {
    const { postStatusButton, clearPostButton } =
      renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearPostButton).toBeDisabled();
  });

  it("enables both buttons when text field has text", async () => {
    const { postStatusButton, clearPostButton, postField, user } =
      renderPostStatusAndGetElements();

    await user.type(postField, "text");
    expect(postStatusButton).toBeEnabled();
    expect(clearPostButton).toBeEnabled();
  });

  it("disables both buttons when text field is cleared", async () => {
    const { postStatusButton, clearPostButton, postField, user } =
      renderPostStatusAndGetElements();

    await user.type(postField, "text");
    expect(postStatusButton).toBeEnabled();
    expect(clearPostButton).toBeEnabled();

    await user.clear(postField);
    expect(postStatusButton).toBeDisabled();
    expect(postStatusButton).toBeDisabled();
  });

  it("calls presenter's postStatus method with correct parameters when post status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { postStatusButton, clearPostButton, postField, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);
    await user.type(postField, "text");
    await user.click(postStatusButton);
    verify(
      mockPresenter.submitPost("text", mockUserInstance, mockAuthTokenInstance)
    ).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    presenter ? <PostStatus presenter={presenter} /> : <PostStatus />
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);

  const postStatusButton = screen.getByLabelText("postStatusButton");
  const clearPostButton = screen.getByRole("button", { name: /clear/i });
  const postField = screen.getByLabelText("post");

  return { postStatusButton, clearPostButton, postField, user };
};
