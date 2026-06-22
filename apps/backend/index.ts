import express from "express";
import { userRoutes } from "./routes/userRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { otpRoutes } from "./routes/otpRoutes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/user", userRoutes);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`running on port ${process.env.SERVER_PORT}`);
});
