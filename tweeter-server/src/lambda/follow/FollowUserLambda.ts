import { FollowCountsResponse, FollowUserRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: FollowUserRequest
): Promise<FollowCountsResponse> => {
  return handleFunction<FollowUserRequest, FollowCountsResponse, FollowService>(
    request,
    FollowService,
    async (service) => {
      const [followerCount, followeeCount] = await service.follow(
        request.token,
        request.userToFollow
      );
      return { followerCount, followeeCount };
    }
  );
};
