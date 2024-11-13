import {
  User,
  AuthToken,
  FakeData,
  LoginRequest,
  RegisterRequest,
  FindUserRequest,
} from "tweeter-shared";
import { ClientService } from "./ClientService";

export class UserService extends ClientService {
  async login(request: LoginRequest): Promise<[User, AuthToken]> {
    return this.serverFacade.login(request);
  }

  async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    return this.serverFacade.register(request);
  }

  async findUserByAlias(request: FindUserRequest) {
    return this.serverFacade.findUserByAlias(request);
  }

  async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
