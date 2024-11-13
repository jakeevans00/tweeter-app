import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  return handleFunction<AuthResponse, UserService>(
    UserService,
    async (service) => {
      const [user, authToken] = await service.register(
        request.firstName,
        request.lastName,
        request.userAlias,
        request.password,
        request.userImageBytes,
        request.imageFileExtension
      );
      return {
        user,
        authToken,
      };
    }
  );
};
