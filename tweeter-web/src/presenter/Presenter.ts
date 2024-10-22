export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class Presenter<T extends View> {
  private _view: T;

  protected constructor(view: T) {
    this._view = view;
  }

  protected get view(): T {
    return this._view;
  }

  protected async tryOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    postOperation?: () => void
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${
          (error as Error).message
        }`
      );
    } finally {
      if (typeof postOperation === "function") {
        postOperation();
      }
    }
  }
}
