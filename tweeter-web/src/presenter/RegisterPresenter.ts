import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import { Buffer } from "buffer";

export interface RegisterView extends AuthView {
  setImageUrl: (url: string) => void;
}
export class RegisterPresenter extends AuthPresenter {
  private userService = new UserService();

  constructor(private registerView: RegisterView) {
    super(registerView);
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

    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
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
        this.registerView.setImageUrl(URL.createObjectURL(file));

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
        this.registerView.setImageUrl("");
        resolve({ imageBytes: new Uint8Array(), imageFileExtension: "" });
      }
    });
  };
}
