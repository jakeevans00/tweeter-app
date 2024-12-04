import { AuthTokenDto } from "tweeter-shared";

export interface SessionDao {
  createSession(userAlias: string): Promise<AuthTokenDto>;
  deleteSession(token: string): Promise<void>;
}
