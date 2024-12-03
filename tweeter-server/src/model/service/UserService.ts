import { AuthToken, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { DaoFactory } from "../factory/DaoFactory";

export class UserService {
  async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  async findUserByAlias(alias: string) {
    const user = FakeData.instance.findUserByAlias(alias);
    return user == null ? null : user?.dto;
  }

  async logout(token: string): Promise<void> {}
}
