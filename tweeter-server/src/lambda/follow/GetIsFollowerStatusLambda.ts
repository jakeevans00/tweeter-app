import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  return handleFunction<IsFollowerResponse, FollowService>(
    FollowService,
    async (service) => {
      const isFollower = await service.getIsFollowerStatus(
        request.token,
        request.userAlias,
        request.selectedUserAlias
      );
      return { isFollower };
    }
  );
};
