import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<T> extends TweeterRequest {
  readonly pageSize: number;
  readonly lastItem: T | null;
}
