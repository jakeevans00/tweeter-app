import { StatusDto } from "tweeter-shared";

export interface FeedDao {
  putFeed(receiverAlias: string, status: StatusDto): Promise<void>;
  getFeed(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
}
