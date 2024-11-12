import { Type } from "../domain/PostSegment";

export interface PostSegmentDto {
  readonly text: string;
  readonly startPostition: number;
  readonly endPosition: number;
  readonly type: Type;
}
