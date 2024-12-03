import { DynamoDbFeedDao } from "../dao/dynamodb/DynamoDbFeedDao";
import { DynamoDbFollowDao } from "../dao/dynamodb/DynamoDbFollowDao";
import { DynamoDbSessionDao } from "../dao/dynamodb/DynamoDbSessionDao";
import { DynamoDbStoryDao } from "../dao/dynamodb/DynamoDbStoryDao";
import { DynamoDbUserDao } from "../dao/dynamodb/DynamoDbUserDao";
import { FeedDao } from "../dao/FeedDao";
import { FollowDao } from "../dao/FollowDao";
import { SessionDao } from "../dao/SessionDao";
import { S3Dao } from "../dao/storage/S3Dao";
import { StorageDao } from "../dao/StorageDao";
import { StoryDao } from "../dao/StoryDao";
import { UserDao } from "../dao/UserDao";
import { DaoFactory } from "./DaoFactory";

export class AwsDaoFactory implements DaoFactory {
  private static instance: DaoFactory;
  private userDao: UserDao;
  private storyDao: StoryDao;
  private feedDao: FeedDao;
  private sessionDao: SessionDao;
  private storageDao: StorageDao;
  private followDao: FollowDao;

  private constructor() {
    this.userDao = new DynamoDbUserDao();
    this.storyDao = new DynamoDbStoryDao();
    this.feedDao = new DynamoDbFeedDao();
    this.sessionDao = new DynamoDbSessionDao();
    this.storageDao = new S3Dao();
    this.followDao = new DynamoDbFollowDao();
  }

  public getInstance() {
    if (!AwsDaoFactory.instance) {
      AwsDaoFactory.instance = new AwsDaoFactory();
    }
    return AwsDaoFactory.instance;
  }

  getStoryDao(): StoryDao {
    return this.storyDao;
  }

  getFeedDao(): FeedDao {
    return this.feedDao;
  }

  getUserDao(): UserDao {
    return this.userDao;
  }

  getSessionDao(): SessionDao {
    return this.sessionDao;
  }

  getStorageDao(): StorageDao {
    return this.storageDao;
  }

  getFollowDao(): FollowDao {
    return this.followDao;
  }
}
