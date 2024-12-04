export interface StorageDao {
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
  getImage(imageUrl: string): Promise<string>;
}
