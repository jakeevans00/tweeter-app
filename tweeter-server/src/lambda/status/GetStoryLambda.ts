import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const followService = new StatusService();
  await followService.postStatus(request.token, request.newStatus);

  return {
    success: true,
    message: null,
  };
};

// Todo
