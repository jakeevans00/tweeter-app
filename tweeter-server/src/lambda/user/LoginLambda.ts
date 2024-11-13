import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleFunction } from "../Utils";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
  return handleFunction<AuthResponse, UserService>(
    UserService,
    async (service) => {
      const [user, authToken] = await service.login(
        request.userAlias,
        request.password
      );
      return {
        user,
        authToken,
      };
    }
  );
};
