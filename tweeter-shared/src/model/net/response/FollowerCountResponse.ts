import { TweeterResponse } from "./TweeterResponse";

export interface FollowerCountResponse extends TweeterResponse {
  followerCount: number;
}
