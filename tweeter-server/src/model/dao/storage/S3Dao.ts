import { StorageDao } from "../StorageDao";
import {
  S3Client,
  ObjectCannedACL,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

export class S3Dao implements StorageDao {
  private readonly bucket = "cs340-bucket-je";
  private readonly region = "us-west-2";

  async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: this.bucket,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: this.region });
    try {
      await client.send(c);
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }

  getImage(imageUrl: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
