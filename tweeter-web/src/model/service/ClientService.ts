import { ServerFacade } from "../../net/ServerFacade";

export abstract class ClientService {
  private _serverFacade;
  constructor() {
    this._serverFacade = new ServerFacade();
  }

  public get serverFacade() {
    return this._serverFacade;
  }
}
