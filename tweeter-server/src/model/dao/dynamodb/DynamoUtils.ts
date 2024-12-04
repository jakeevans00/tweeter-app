import { QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { StatusDto, UserDto } from "tweeter-shared";

export function parseStatusItems(
  data: QueryCommandOutput
): [StatusDto[], boolean] {
  const items: StatusDto[] = [];

  const hasMorePages = data.LastEvaluatedKey !== undefined;
  data.Items?.forEach((item) => {
    const userDto: UserDto = {
      firstName: item.author_first_name,
      lastName: item.author_last_name,
      alias: item.author_alias,
      imageUrl: item.author_image_url,
    };
    const statusDto: StatusDto = {
      post: item.post,
      user: userDto,
      timestamp: item.timestamp,
      postSegments: item.post_segments,
    };
    items.push(statusDto);
  });
  return [items, hasMorePages];
}
