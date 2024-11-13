import { FindUserRequest, UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: FindUserRequest
): Promise<UserResponse> => {
  return handleFunction<UserResponse, UserService>(
    UserService,
    async (service) => {
      const user = await service.findUserByAlias(request.userToFind);
      return { user };
    }
  );
};
