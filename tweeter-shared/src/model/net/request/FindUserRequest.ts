import { TweeterRequest } from "./TweeterRequest";

export interface FindUserRequest extends TweeterRequest {
  readonly userToFind: string;
}
