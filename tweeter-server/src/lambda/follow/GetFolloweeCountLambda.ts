import { FolloweeCountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: TweeterRequest
): Promise<FolloweeCountResponse> => {
  const followService = new FollowService();
  const followeeCount = await followService.getFolloweeCount(
    request.token,
    request.userAlias
  );

  return {
    success: true,
    message: null,
    followeeCount,
  };
};
