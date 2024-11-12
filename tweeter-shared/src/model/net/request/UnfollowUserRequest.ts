import { TweeterRequest } from "./TweeterRequest";

export interface UnfollowUserRequest extends TweeterRequest {
  readonly userToUnfollow: string;
}
