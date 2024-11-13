import { PagedItemRequest, StatusDto } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("StatusService", () => {
  let statusService: StatusService;
  const PAGE_SIZE = 5;

  beforeAll(() => {
    statusService = new StatusService();
  });

  it("returns a list of Status representing a user's story pages", async () => {
    const getStoryRequest: PagedItemRequest<StatusDto> = {
      token: "token",
      userAlias: "@amy",
      pageSize: PAGE_SIZE,
      lastItem: null,
    };
    const [items, hasMore] = await statusService.loadMoreStory(getStoryRequest);
    expect(items.length).toBe(PAGE_SIZE);
    expect(hasMore).toBeTruthy();
    expect(items[0].post).toBeTruthy();
  });
});
