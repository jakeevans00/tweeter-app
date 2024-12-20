import { TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { FollowService } from "../model/service/FollowService";
import { UserService } from "../model/service/UserService";

type BaseService = StatusService | FollowService | UserService;

export const handleFunction = async <
  TResponse extends TweeterResponse,
  TService extends BaseService
>(
  ServiceClass: new () => TService,
  serviceMethod: (service: TService) => Promise<Partial<TResponse>>
): Promise<TResponse> => {
  const service = new ServiceClass();
  let response;
  try {
    response = await serviceMethod(service);
  } catch (error) {
    throw new Error("[ServerError] " + (error as Error).message);
  }

  return {
    success: true,
    message: null,
    ...response,
  } as TResponse;
};
