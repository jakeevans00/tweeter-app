import { FakeData, Status } from "tweeter-shared";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";

export class StatusService {
  public async loadMoreFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const [items, hasMoreItems] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = items.map((item) => item.dto);
    return [dtos, hasMoreItems];
  }

  public async loadMoreStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const [items, hasMoreItems] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = items.map((item) => item.dto);
    return [dtos, hasMoreItems];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
