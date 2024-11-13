import { FolloweeCountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: TweeterRequest
): Promise<FolloweeCountResponse> => {
  return handleFunction<FolloweeCountResponse, FollowService>(
    FollowService,
    async (service) => {
      const followeeCount = await service.getFolloweeCount(
        request.token,
        request.userAlias
      );
      return {
        followeeCount,
      };
    }
  );
};
