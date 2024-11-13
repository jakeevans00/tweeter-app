import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  return handleFunction<TweeterResponse, StatusService>(
    StatusService,
    async (service) => {
      await service.postStatus(request.token, request.newStatus);
      return {};
    }
  );
};
