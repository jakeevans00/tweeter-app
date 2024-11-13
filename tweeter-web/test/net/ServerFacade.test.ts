import { ServerFacade } from "../../src/net/ServerFacade";
import {
  PagedItemRequest,
  RegisterRequest,
  TweeterRequest,
  UserDto,
} from "tweeter-shared";
import "isomorphic-fetch";

describe("ServerFacade", () => {
  let serverFacade: ServerFacade;
  let testUser = {
    userAlias: `testUser`,
    firstName: "Test",
    lastName: "User",
    password: "password123",
  };
  const PAGE_SIZE = 5;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  it("returns a valid authToken on Register request", async () => {
    const registerRequest: RegisterRequest = {
      token: "",
      userAlias: testUser.userAlias,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      password: testUser.password,
      userImageBytes: "bytes",
      imageFileExtension: "file",
    };
    const [user, authToken] = await serverFacade.register(registerRequest);
    expect(user).toBeTruthy();
    expect(authToken).toBeTruthy();
    expect(authToken.token).not.toBe("");
  });

  it("gets a list of followers containing requested amount", async () => {
    const getFollowersRequest: PagedItemRequest<UserDto> = {
      token: "token",
      userAlias: testUser.userAlias,
      pageSize: PAGE_SIZE,
      lastItem: null,
    };
    const [items, hasMore] = await serverFacade.getMoreFollowers(
      getFollowersRequest
    );
    expect(items.length).toBe(PAGE_SIZE);
    expect(hasMore).toBeTruthy();
  });

  it("gets the count of followers and/or followees for given user", async () => {
    const getCountRequest: TweeterRequest = {
      token: "token",
      userAlias: "@amy",
    };
    const followerCount = await serverFacade.getFollowerCount(getCountRequest);
    const followeeCount = await serverFacade.getFolloweeCount(getCountRequest);

    expect(typeof followerCount).toBe("number");
    expect(typeof followeeCount).toBe("number");
  });
});
