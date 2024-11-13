import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { handleFunction } from "../Utils";

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  return handleFunction<PagedItemResponse<StatusDto>, StatusService>(
    StatusService,
    async (service) => {
      const [items, hasMore] = await service.loadMoreFeed(
        request.token,
        request.userAlias,
        request.pageSize,
        request.lastItem
      );
      return { items, hasMore };
    }
  );
};
