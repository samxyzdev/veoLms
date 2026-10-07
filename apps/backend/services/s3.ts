// services/s3.ts
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";
/* -------------------------------------------------------------------------- */
/*                                S3 CLIENT                                   */
/* -------------------------------------------------------------------------- */

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
/* -------------------------------------------------------------------------- */
/*                              ENVIRONMENT                                   */
/* -------------------------------------------------------------------------- */
const bucketName = process.env.AWS_S3_BUCKET!;
/* -------------------------------------------------------------------------- */
/*                              KEY GENERATOR                                 */
/* -------------------------------------------------------------------------- */
export function createS3Key({ folder, fileName }: { folder: string; fileName: string }) {
  const extension = fileName.includes(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";

  const uniqueId = crypto.randomUUID();

  return `${folder}/${uniqueId}${extension}`;
}
/* -------------------------------------------------------------------------- */
/*                         CREATE PRESIGNED UPLOAD URL                        */
/* -------------------------------------------------------------------------- */
export async function createPresignedUploadUrl({ key, contentType, expiresIn = 900 }: { key: string; contentType: string; expiresIn?: number }) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn,
  });

  return uploadUrl;
}
/* -------------------------------------------------------------------------- */
/*                         CREATE PRESIGNED DOWNLOAD URL                      */
/* -------------------------------------------------------------------------- */
// thumbnial ko preview karenge.
export async function createPresignedDownloadUrl({ key, expiresIn = 900 }: { key: string; expiresIn?: number }) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const downloadUrl = await getSignedUrl(s3, command, {
    expiresIn,
  });

  return downloadUrl;
}
/* -------------------------------------------------------------------------- */
/*                              DELETE OBJECT                                 */
/* -------------------------------------------------------------------------- */
export async function deleteS3Object(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3.send(command);
}
/* -------------------------------------------------------------------------- */
/*                            CHECK OBJECT EXISTS                             */
/* -------------------------------------------------------------------------- */
export async function headS3Object(key: string) {
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await s3.send(command);
}
