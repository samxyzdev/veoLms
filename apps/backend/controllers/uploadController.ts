import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

type StorageClient = {
  client: S3Client;
  bucket: string;
  publicUrl: string;
};

function createStorageClient(): StorageClient | null {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucket || !publicUrl) {
    return null;
  }

  return {
    client: new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    }),
    bucket,
    publicUrl: publicUrl.replace(/\/$/, ""),
  };
}

/**
 * Generate the short-lived R2 URL used by the admin's
 * direct video upload.
 */
export const createVideoUploadUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileName, fileType } = req.query;

    if (typeof fileName !== "string" || typeof fileType !== "string") {
      return res.status(400).json({
        message: "File name and file type are required.",
      });
    }

    if (!fileType.startsWith("video/")) {
      return res.status(400).json({
        message: "Only video uploads are supported.",
      });
    }

    const storage = createStorageClient();

    if (!storage) {
      return res.status(503).json({
        message: "Video storage is currently unavailable.",
      });
    }

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

    const fileKey = `${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

    const uploadUrl = await getSignedUrl(
      storage.client,
      new PutObjectCommand({
        Bucket: storage.bucket,
        Key: fileKey,
        ContentType: fileType,
      }),
      {
        expiresIn: 300,
      },
    );

    return res.status(200).json({
      data: {
        uploadUrl,
        fileKey,
        publicUrl: `${storage.publicUrl}/${encodeURIComponent(fileKey)}`,
      },
    });
  } catch (error) {
    return next(error);
  }
};
