import { StatusDto } from "tweeter-shared";

export interface StoryDao {
  putStatus(status: StatusDto): Promise<void>;
  getStory(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
}
