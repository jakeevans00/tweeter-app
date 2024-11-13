import { FollowCountsResponse, UnfollowUserRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: UnfollowUserRequest
): Promise<FollowCountsResponse> => {
  return handleFunction<FollowCountsResponse, FollowService>(
    FollowService,
    async (service) => {
      const [followerCount, followeeCount] = await service.unfollow(
        request.token,
        request.userToUnfollow
      );
      return { followerCount, followeeCount };
    }
  );
};
