/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "../config/env.config";
import { Upload } from "@aws-sdk/lib-storage";
import { CompleteMultipartUploadCommandOutput, S3 } from "@aws-sdk/client-s3";
import { errorLogger, infoLogger } from "../utils/logger";
import { uniqueId } from "lodash";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  NODE_ENV,
  AWS_BUCKET_NAME,
  AWS_REGION,
} = envConfig;

class FileUploader {
  private s3Client: S3;
  private bucketName: string;

  constructor() {
    const accessKeyId = AWS_ACCESS_KEY_ID;
    const secretAccessKey = AWS_SECRET_ACCESS_KEY;

    this.s3Client = new S3({
      region: AWS_REGION,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.bucketName = AWS_BUCKET_NAME;
  }
  async uploadFile(file: Express.Multer.File) {
    try {
      const originalName = `${file?.originalname}-${uniqueId()}`;

      const params = {
        Bucket: this.bucketName,
        Key: `${NODE_ENV}/images/${originalName}.${file?.originalname
          .split(".")
          .pop()}`,
        Body: file?.buffer,
      };

      const upload = new Upload({
        params,
        client: this.s3Client,
        queueSize: 5,
        partSize: 5 * 1024 * 1024,
      });

      upload.on("httpUploadProgress", (progress) => {
        infoLogger.log(progress);
      });

      const result =
        (await upload.done()) as CompleteMultipartUploadCommandOutput;
      infoLogger.log({ message: "Upload Successful", result });
      return { success: true, location: result.Location };
    } catch (error: any) {
      errorLogger.log(error);
      return { success: false, message: error?.message };
    }
  }
}

export default FileUploader;
