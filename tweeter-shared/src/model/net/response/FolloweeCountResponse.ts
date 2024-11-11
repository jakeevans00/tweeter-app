import { TweeterResponse } from "./TweeterResponse";

export interface FolloweeCountResponse extends TweeterResponse {
  followeeCount: number;
}
