import { FindUserRequest, TweeterRequest, UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: FindUserRequest
): Promise<UserResponse> => {
  const userService = new UserService();
  const user = await userService.findUserByAlias(request.userToFind);
  return {
    success: true,
    message: null,
    user,
  };
};
