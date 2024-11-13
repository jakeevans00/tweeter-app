import {
  PagedItemRequest,
  PostStatusRequest,
  Status,
  StatusDto,
} from "tweeter-shared";
import { ClientService } from "./ClientService";

export class StatusService extends ClientService {
  public async loadMoreFeed(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreFeed(request);
  }

  public async loadMoreStory(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreStory(request);
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    return this.serverFacade.postStatus(request);
  }
}
