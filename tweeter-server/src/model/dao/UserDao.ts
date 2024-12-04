import { UserDto } from "tweeter-shared";
import { UserDBItem } from "../service/UserService";

export interface UserDao {
  getUser(alias: string): Promise<UserDBItem | null>;
  putUser(user: UserDBItem): Promise<UserDto | null>;
}
