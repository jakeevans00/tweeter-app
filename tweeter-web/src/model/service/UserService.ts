import {
  User,
  AuthToken,
  LoginRequest,
  RegisterRequest,
  FindUserRequest,
  TweeterRequest,
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

  async logout(request: TweeterRequest): Promise<void> {
    return this.serverFacade.logout(request);
  }
}
