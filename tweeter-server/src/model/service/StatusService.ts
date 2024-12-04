import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";
import { StoryDao } from "../dao/StoryDao";
import { FeedDao } from "../dao/FeedDao";
import { AwsDaoFactory } from "../factory/AwsDaoFactory";
import { FollowDao } from "../dao/FollowDao";

export class StatusService {
  private storyDao: StoryDao;
  private feedDao: FeedDao;
  private followDao: FollowDao;
  constructor() {
    this.feedDao = AwsDaoFactory.getInstance().getFeedDao();
    this.storyDao = AwsDaoFactory.getInstance().getStoryDao();
    this.followDao = AwsDaoFactory.getInstance().getFollowDao();
  }

  public async loadMoreFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.feedDao.getFeed(token, userAlias, pageSize, lastItem);
  }

  public async loadMoreStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.storyDao.getStory(token, userAlias, pageSize, lastItem);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.storyDao.putStatus(newStatus);
    let lastEvaluatedKey = undefined;

    do {
      const [followers, hasMore] = await this.followDao.getPageOfFollowers(
        newStatus.user.alias,
        25,
        lastEvaluatedKey
      );

      await Promise.all(
        followers.map((userDto) =>
          this.feedDao.putFeed(userDto.alias, newStatus)
        )
      );

      lastEvaluatedKey = hasMore
        ? followers[followers.length - 1]?.alias
        : undefined;
    } while (lastEvaluatedKey);
  }
}
