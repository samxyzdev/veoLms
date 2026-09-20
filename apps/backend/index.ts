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
import { adminRoutes } from "./routes/adminRoutes";

const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error("COOKIE_SECRET is required to sign session cookies.");
}

const port = Number(process.env.SERVER_PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("SERVER_PORT must be a valid TCP port.");
}

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
app.use(cookieParser(cookieSecret));

app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin", adminDashboardRoutes);
app.use("/api/v1/admin/uploads", adminRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
