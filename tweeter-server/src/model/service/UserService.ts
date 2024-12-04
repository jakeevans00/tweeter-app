import { UserDto, AuthTokenDto } from "tweeter-shared";
import { AwsDaoFactory } from "../factory/AwsDaoFactory";
import { UserDao } from "../dao/UserDao";
import { SessionDao } from "../dao/SessionDao";
import { StorageDao } from "../dao/StorageDao";
import * as bcrypt from "bcryptjs";

export interface UserDBItem {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  imageUrl: string;
  followeeCount: number;
  followerCount: number;
}

export class UserService {
  private userDao: UserDao;
  private sessionDao: SessionDao;
  private storageDao: StorageDao;

  constructor() {
    this.userDao = AwsDaoFactory.getInstance().getUserDao();
    this.sessionDao = AwsDaoFactory.getInstance().getSessionDao();
    this.storageDao = AwsDaoFactory.getInstance().getStorageDao();
  }

  async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDBItem = await this.userDao.getUser(alias);

    if (userDBItem === null) {
      throw new Error("User does not exist");
    }
    const passwordMatch = await bcrypt.compare(password, userDBItem.password);
    if (!passwordMatch) {
      throw new Error("Invalid alias or password");
    }
    const authDto = await this.sessionDao.createSession(userDBItem.alias);

    return [this.toUserDto(userDBItem), authDto];
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const existingUser = await this.findUserByAlias(alias);
    if (existingUser) {
      throw new Error("User alias already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 6);
    const imageUrl = await this.storageDao.putImage(
      imageFileExtension,
      userImageBytes
    );

    const newUserDBItem: UserDBItem = {
      firstName,
      lastName,
      alias,
      password: hashedPassword,
      imageUrl,
      followeeCount: 0,
      followerCount: 0,
    };
    const savedUser = await this.userDao.putUser(newUserDBItem);
    if (savedUser === null) {
      throw new Error("Invalid registration");
    }

    const authDto = await this.sessionDao.createSession(savedUser.alias);
    return [savedUser, authDto];
  }

  async findUserByAlias(alias: string): Promise<UserDto | null> {
    const userDBItem = await this.userDao.getUser(alias);
    if (!userDBItem) return null;
    return this.toUserDto(userDBItem);
  }

  async logout(token: string): Promise<void> {
    await this.sessionDao.deleteSession(token);
  }

  private toUserDto(item: UserDBItem) {
    const { password, followeeCount, followerCount, ...userDto } = item;
    return userDto;
  }
}
