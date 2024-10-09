import useUserInfo from "./UserInfoHook";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import {
  NavigateUserPresenter,
  NavigateUserView,
} from "../../presenter/NavigateUserPresenter";

const useNavigateUser = () => {
  const { authToken, currentUser, setDisplayedUser } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener: NavigateUserView = {
    setDisplayedUser,
    displayErrorMessage,
  };
  const [presenter] = useState(new NavigateUserPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    presenter.navigateToUser(
      authToken!,
      currentUser!,
      event.currentTarget.toString()
    );
  };

  return { navigateToUser };
};

export default useNavigateUser;
