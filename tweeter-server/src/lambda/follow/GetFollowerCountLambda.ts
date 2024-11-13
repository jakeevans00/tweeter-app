import { FollowerCountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: TweeterRequest
): Promise<FollowerCountResponse> => {
  return handleFunction<FollowerCountResponse, FollowService>(
    FollowService,
    async (service) => {
      const followerCount = await service.getFollowerCount(
        request.token,
        request.userAlias
      );
      return { followerCount };
    }
  );
};
