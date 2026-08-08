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

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`running on port ${process.env.SERVER_PORT}`);
});
