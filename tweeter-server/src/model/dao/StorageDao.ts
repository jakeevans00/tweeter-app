export interface StorageDao {
  uploadImage(imageBytes: string, fileExtension: string): Promise<string>;
  getImage(imageUrl: string): Promise<string>;
}
