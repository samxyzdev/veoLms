import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { checkAuth } from "../middleware/checkAuth";
import { checkAdmin } from "../middleware/checkAdmin";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3 Client Setup (Works for both AWS and Cloudflare R2)

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// Pehle hi check kar lo
if (!accessKeyId || !secretAccessKey) {
  throw new Error(
    "CRITICAL ERROR: AWS Credentials are missing in the .env file",
  );
}
const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const adminRoutes: Router = Router();

// adming video ko upalod kar skta hai
// to yahan se uplaod url send karenge.
adminRoutes.get("/", checkAuth, checkAdmin, async (req, res, next) => {
  try {
    const { fileName, fileType } = req.query;
    const uniqueFileName = `${Date.now() - fileName}`;
    const command = new PutObjectCommand({
      Bucket: "Your bucket name",
      key: uniqueFileName,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });
    return res.status(200).json({
      uploadUrl: presignedUrl,
      fileKey: uniqueFileName,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Failed to generate upload URL",
    });
  }
});

// adming editing course
// not the video on bucket but titlte or descriptoins
// cousre contentsTable main
adminRoutes.post(
  "/:courseId",
  checkAuth,
  checkAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "userId not found",
      });
    }
    const courseId = req.params.courseId;
  },
);
