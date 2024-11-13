import { RegisterRequest } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import { Buffer } from "buffer";

export interface RegisterView extends AuthView {
  setImageUrl: (url: string) => void;
}
export class RegisterPresenter extends AuthPresenter {
  protected getAuthDescription(): string {
    return "register user";
  }

  constructor(registerView: RegisterView) {
    super(registerView);
  }

  protected get view() {
    return super.view as RegisterView;
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    if (
      this.checkSubmitButtonStatus(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      )
    ) {
      return;
    }
    super.authenticate(async () => {
      const imageStringBase64: string =
        Buffer.from(imageBytes).toString("base64");
      const registerRequest: RegisterRequest = {
        token: "",
        userAlias: alias,
        firstName,
        lastName,
        password,
        userImageBytes: imageStringBase64,
        imageFileExtension,
      };
      const [user, authToken] = await this.service.register(registerRequest);
      this.view.updateUserInfo(user, user, authToken, rememberMe);
    }, "/");
  }

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      imageBytes.length === 0 ||
      !imageFileExtension
    );
  }

  public handleImageFile = (
    file: File | undefined
  ): Promise<{ imageBytes: Uint8Array; imageFileExtension: string }> => {
    return new Promise((resolve, reject) => {
      if (file) {
        this.view.setImageUrl(URL.createObjectURL(file));

        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const imageStringBase64 = event.target?.result as string;
          const imageStringBase64BufferContents =
            imageStringBase64.split("base64,")[1];
          const imageBytes: Uint8Array = Buffer.from(
            imageStringBase64BufferContents,
            "base64"
          );
          const imageFileExtension = file.name.split(".").pop() || "";

          resolve({ imageBytes, imageFileExtension });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      } else {
        this.view.setImageUrl("");
        resolve({ imageBytes: new Uint8Array(), imageFileExtension: "" });
      }
    });
  };
}
