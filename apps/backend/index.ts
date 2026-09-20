import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { userRoutes } from "./routes/userRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { otpRoutes } from "./routes/otpRoutes";
import { courseRoutes } from "./routes/courseRoutes";
import { adminDashboardRoutes } from "./routes/adminDashboardRoutes";
import { adminAuthRoutes } from "./routes/adminAuthRoutes";

const app = express();

app.use(express.json());
// Auth uses an httpOnly cookie, so requests carry credentials and CORS cannot
// use "*". Allow the frontend dev server (any localhost port) plus any origin
// listed in CORS_ORIGINS (comma separated) for production.
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

      // No Origin header = same-origin request / curl / mobile client.
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin", adminDashboardRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`running on port ${process.env.SERVER_PORT}`);
});
