import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: TweeterRequest
): Promise<TweeterResponse> => {
  return handleFunction<TweeterResponse, UserService>(
    UserService,
    async (service) => {
      await service.logout(request.token);
      return {};
    }
  );
};
