import { AuthToken, FakeData, PostStatusRequest, Status } from "tweeter-shared";
import { ClientService } from "./ClientService";

export class StatusService extends ClientService {
  public async loadMoreFeed(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async loadMoreStory(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    return this.serverFacade.postStatus(request);
  }
}
