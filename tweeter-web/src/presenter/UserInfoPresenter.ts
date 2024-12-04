import {
  AuthToken,
  FollowUserRequest,
  IsFollowerRequest,
  TweeterRequest,
  UnfollowUserRequest,
  User,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setIsFollowerStatus: (status: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService = new FollowService();
  private _isLoading: boolean = false;
  private _isFollower: boolean = false;

  constructor(view: UserInfoView) {
    super(view);
  }

  public get isLoading() {
    return this._isLoading;
  }

  protected set isLoading(value: boolean) {
    this._isLoading = value;
  }

  public get isFollower() {
    return this._isFollower;
  }

  private set isFollower(value: boolean) {
    this._isFollower = value;
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    super.tryOperation(async () => {
      const request: TweeterRequest = {
        token: authToken.token,
        userAlias: displayedUser.alias,
      };
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(request)
      );
    }, "get followers count");
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    super.tryOperation(async () => {
      if (currentUser === displayedUser) {
        this._isFollower = false;
      } else {
        const isFollowerRequest: IsFollowerRequest = {
          token: authToken.token,
          userAlias: currentUser.alias,
          selectedUserAlias: displayedUser.alias,
        };
        this._isFollower = await this.followService.getIsFollowerStatus(
          isFollowerRequest
        );
        this.view.setIsFollowerStatus(this._isFollower);
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    super.tryOperation(async () => {
      const request: TweeterRequest = {
        token: authToken.token,
        userAlias: displayedUser.alias,
      };
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(request)
      );
    }, "get followees count");
  }

  public async followDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
    currentUser: User
  ) {
    super.tryOperation(
      async () => {
        this._isLoading = true;
        this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

        const followRequest: FollowUserRequest = {
          token: authToken.token,
          userAlias: currentUser.alias,
          userToFollow: displayedUser.alias,
        };
        const [followerCount, followeeCount] = await this.followService.follow(
          followRequest
        );

        this._isFollower = true;
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "follow user",
      () => {
        this.view.clearLastInfoMessage();
        this._isLoading = false;
      }
    );
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
    currentUser: User
  ) {
    super.tryOperation(
      async () => {
        this._isLoading = true;
        this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0
        );

        const unfollowRequest: UnfollowUserRequest = {
          token: authToken.token,
          userAlias: currentUser.alias,
          userToUnfollow: displayedUser.alias,
        };
        const [followerCount, followeeCount] =
          await this.followService.unfollow(unfollowRequest);

        this._isFollower = false;
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "unfollow user",
      () => {
        this.view.clearLastInfoMessage();
        this._isLoading = false;
      }
    );
  }
}
