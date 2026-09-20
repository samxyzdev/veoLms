import { Router } from "express";
import { signInAdmin, signUpAdmin } from "../controllers/adminAuthController";

/** Admin authentication endpoint registration. */
export const adminAuthRoutes = Router();

adminAuthRoutes.post("/signup", signUpAdmin);
adminAuthRoutes.post("/signin", signInAdmin);
