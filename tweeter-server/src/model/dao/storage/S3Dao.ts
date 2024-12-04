import { StorageDao } from "../StorageDao";

export class S3Dao implements StorageDao {
  async uploadImage(
    imageBytes: string,
    fileExtension: string
  ): Promise<string> {
    return "test image";
  }
  getImage(imageUrl: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
