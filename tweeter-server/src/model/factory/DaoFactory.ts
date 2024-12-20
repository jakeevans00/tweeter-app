import { FeedDao } from "../dao/FeedDao";
import { FollowDao } from "../dao/FollowDao";
import { SessionDao } from "../dao/SessionDao";
import { StorageDao } from "../dao/StorageDao";
import { StoryDao } from "../dao/StoryDao";
import { UserDao } from "../dao/UserDao";

export interface DaoFactory {
  getStoryDao(): StoryDao;
  getFeedDao(): FeedDao;
  getUserDao(): UserDao;
  getSessionDao(): SessionDao;
  getFollowDao(): FollowDao;
  getStorageDao(): StorageDao;
}
