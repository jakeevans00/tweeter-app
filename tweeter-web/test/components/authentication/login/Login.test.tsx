import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button when both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();
  });

  it("disabled the sign in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "c");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls presenter's login method with correct parameters when sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "@SomeAlias";
    const password = "password";

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();
  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByLabelText("submit-button");
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};
