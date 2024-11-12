import { TweeterRequest } from "./TweeterRequest";

export interface FollowUserRequest extends TweeterRequest {
  readonly userToFollow: string;
}
