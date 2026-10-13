// controllers/courseCreatorUploadController.ts

import { and, coursesTable, db, eq } from "@repo/database";
import type { Request, Response } from "express";
import { createPresignedUploadUrl, createS3Key } from "../services/s3";

export async function createCourseVideoUploadUrl(req: Request, res: Response) {
  try {
    const { courseId } = req.params;
    const userId = req.userId;
    const { fileName, contentType, fileSize } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required." });
    if (typeof fileName !== "string" || !fileName.trim() || fileName.length > 255 || typeof contentType !== "string" || !Number.isFinite(fileSize)) {
      return res.status(400).json({ success: false, message: "fileName, contentType and fileSize are required." });
    }

    const [course] = await db
      .select({ id: coursesTable.id })
      .from(coursesTable)
      .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)))
      .limit(1);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ success: false, message: "Only MP4, WebM, MOV and AVI videos are allowed." });
    }
    if (fileSize <= 0 || fileSize > 2 * 1024 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "Video size must be less than or equal to 2GB." });
    }

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = createS3Key({ folder: `courses/${courseId}/videos`, fileName: safeFileName });
    const uploadUrl = await createPresignedUploadUrl({ key, contentType, expiresIn: 900 });
    return res.status(200).json({
      success: true,
      message: "Video upload URL created successfully.",
      data: { uploadUrl, key },
    });
  } catch (error) {
    console.error("createCourseVideoUploadUrl error:", error);
    return res.status(500).json({ success: false, message: "Failed to create video upload URL." });
  }
}

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
