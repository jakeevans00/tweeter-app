import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
  return handleFunction<PagedItemResponse<UserDto>, FollowService>(
    FollowService,
    async (service) => {
      const [items, hasMore] = await service.loadMoreFollowees(
        request.token,
        request.userAlias,
        request.pageSize,
        request.lastItem
      );
      return {
        items,
        hasMore,
      };
    }
  );
};
