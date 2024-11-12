import { FollowCountsResponse, UnfollowUserRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

type NewType = FollowCountsResponse;

export const handler = async (
  request: UnfollowUserRequest
): Promise<NewType> => {
  const followService = new FollowService();
  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.userToUnfollow
  );

  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
};
