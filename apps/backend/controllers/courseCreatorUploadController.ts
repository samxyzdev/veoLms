// controllers/courseCreatorUploadController.ts

import type { Request, Response } from "express";
import { createPresignedUploadUrl, createS3Key } from "../services/s3";

export async function createCourseThumbnailUploadUrl(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const { fileName, contentType } = req.body;
    if (!fileName || !contentType) {
      return res.status(400).json({
        success: false,
        message: "fileName and contentType are required",
      });
    }
    /* ---------------------------------------------------------------------- */
    /*                         VALIDATE CONTENT TYPE                          */
    /* ---------------------------------------------------------------------- */
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG and WEBP images are allowed",
      });
    }
    /* ---------------------------------------------------------------------- */
    /*                               S3 KEY                                   */
    /* ---------------------------------------------------------------------- */
    const key = createS3Key({
      folder: `courses/${courseId}/thumbnail`,
      fileName,
    });
    /* ---------------------------------------------------------------------- */
    /*                         PRESIGNED URL                                  */
    /* ---------------------------------------------------------------------- */
    const uploadUrl = await createPresignedUploadUrl({
      key,
      contentType,
      expiresIn: 900,
    });

    return res.status(200).json({
      success: true,
      message: "Upload URL created successfully",
      data: {
        uploadUrl,
        key,
      },
    });
  } catch (error) {
    console.error("createCourseThumbnailUploadUrl error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create upload URL",
    });
  }
}
