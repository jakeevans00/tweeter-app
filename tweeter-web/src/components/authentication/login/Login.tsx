import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { AuthView } from "../../../presenter/AuthPresenter";
import { LoginPresenter } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter") {
      doLogin(alias, password);
    }
  };

  const listener: AuthView = {
    navigate: navigate,
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    setIsLoading: setIsLoading,
  };

  const [presenter] = useState(props.presenter ?? new LoginPresenter(listener));

  const doLogin = async (alias: string, password: string) => {
    presenter.doLogin(alias, password, rememberMe, props?.originalUrl);
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          fn={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() =>
        presenter.checkSubmitButtonStatus(alias, password)
      }
      isLoading={presenter.isLoading}
      submit={() => doLogin(alias, password)}
    />
  );
};

export default Login;
