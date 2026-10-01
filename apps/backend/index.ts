import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { studentRoutes, userRoutes } from "./routes/userRoutes";
import { otpRoutes } from "./routes/otpRoutes";
import { courseRoutes } from "./routes/courseRoutes";
import { adminDashboardRoutes } from "./routes/adminDashboardRoutes";
import { adminAuthRoutes } from "./routes/adminAuthRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { dashboardRoutes } from "./routes/dashboardStatsRoutes";
import { checkAuth } from "./middleware/checkAuth";

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

const allowedOrigins = process.env.CORS_ORIGINS?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(cookieParser(cookieSecret));

app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/course-creator/auth", adminAuthRoutes);
app.use("/api/v1/course-creator", adminDashboardRoutes);
app.use("/api/v1/course-creator/uploads", adminRoutes);

// 404 - Route not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
