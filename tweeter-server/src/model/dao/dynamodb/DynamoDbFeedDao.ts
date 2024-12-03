import { FeedDao } from "../FeedDao";

export class DynamoDbFeedDao implements FeedDao {
  getFeed(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
