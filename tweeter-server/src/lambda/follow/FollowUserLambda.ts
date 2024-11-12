import { FollowCountsResponse, FollowUserRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: FollowUserRequest
): Promise<FollowCountsResponse> => {
  const followService = new FollowService();
  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.userToFollow
  );

  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
};
