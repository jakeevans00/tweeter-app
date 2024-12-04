import { FakeData, Status } from "tweeter-shared";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";
import { StoryDao } from "../dao/StoryDao";
import { FeedDao } from "../dao/FeedDao";
import { AwsDaoFactory } from "../factory/AwsDaoFactory";

export class StatusService {
  private storyDao: StoryDao;
  private feedDao: FeedDao;
  constructor() {
    this.feedDao = AwsDaoFactory.getInstance().getFeedDao();
    this.storyDao = AwsDaoFactory.getInstance().getStoryDao();
  }

  public async loadMoreFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.storyDao.getStory(token, userAlias, pageSize, lastItem);
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.storyDao.putStatus(newStatus);
  }
}
