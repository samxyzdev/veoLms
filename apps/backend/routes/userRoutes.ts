import { Router } from "express";

export const userRoutes = Router();

userRoutes.post("/signup", (req, res, next) => {
  console.log("hello from signup");
});
