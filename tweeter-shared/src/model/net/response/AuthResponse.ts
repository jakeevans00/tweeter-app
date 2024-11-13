import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { UserResponse } from "./UserResponse";

export interface AuthResponse extends UserResponse {
  readonly authToken: AuthTokenDto;
}
