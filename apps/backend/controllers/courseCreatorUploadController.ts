// controllers/courseCreatorUploadController.ts

import { and, coursesTable, db, eq } from "@repo/database";
import type { Request, Response } from "express";
import { createPresignedUploadUrl, createS3Key } from "../services/s3";

// Keep your existing project imports for:
// db, coursesTable, createS3Key, createPresignedUploadUrl

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createCourseVideoUploadUrl(req: Request, res: Response) {
  try {
    // 1. Read request parameters
    const courseIdParam: unknown = req.params.courseId;
    const userId = req.userId;

    const { fileName, contentType, fileSize } = req.body ?? {};

    // 2. Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // 3. Validate course ID
    if (typeof courseIdParam !== "string" || !UUID_REGEX.test(courseIdParam)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID.",
      });
    }

    // TypeScript now knows courseId is a string.
    const courseId = courseIdParam;

    // 4. Validate request body
    if (
      typeof fileName !== "string" ||
      !fileName.trim() ||
      fileName.length > 255 ||
      typeof contentType !== "string" ||
      !contentType.trim() ||
      typeof fileSize !== "number" ||
      !Number.isFinite(fileSize)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid fileName, contentType and fileSize are required.",
      });
    }

    // 5. Check whether the course belongs to the current creator
    const [course] = await db
      .select({
        id: coursesTable.id,
      })
      .from(coursesTable)
      .where(and(eq(coursesTable.id, courseId), eq(coursesTable.createdBy, userId)))
      .limit(1);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // 6. Allow only supported video formats
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];

    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({
        success: false,
        message: "Only MP4, WebM, MOV and AVI videos are allowed.",
      });
    }

    // 7. Validate video size (maximum 2 GiB)
    const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024;

    if (fileSize <= 0 || fileSize > MAX_VIDEO_SIZE) {
      return res.status(400).json({
        success: false,
        message: "Video size must be greater than 0 and at most 2 GiB.",
      });
    }

    // 8. Sanitize filename
    const safeFileName = fileName.trim().replace(/[^a-zA-Z0-9._-]/g, "_");

    // 9. Generate the S3/R2 object key
    const key = createS3Key({
      folder: `courses/${courseId}/videos`,
      fileName: safeFileName,
    });

    // 10. Generate presigned upload URL (15 minutes)
    const uploadUrl = await createPresignedUploadUrl({
      key,
      contentType,
      expiresIn: 900,
    });

    // 11. Return upload URL and object key
    return res.status(200).json({
      success: true,
      message: "Video upload URL created successfully.",
      data: {
        uploadUrl,
        key,
      },
    });
  } catch (error) {
    console.error("createCourseVideoUploadUrl error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create video upload URL.",
    });
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
