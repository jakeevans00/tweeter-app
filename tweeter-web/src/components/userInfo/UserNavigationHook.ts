import useUserInfo from "./UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { AuthToken, FakeData, User } from "tweeter-shared";

const useNavigateUser = () => {
  const { authToken, currentUser, setDisplayedUser } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  const navigateToUser = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      const alias = extractAlias(event.currentTarget.toString());
      const user = await getUser(authToken!, alias);
      if (user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return { navigateToUser };
};

export default useNavigateUser;
