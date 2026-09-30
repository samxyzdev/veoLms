import type { NextFunction, Request, Response } from "express";
import { db, eq, sessionTable } from "@repo/database";
import { hashFunction } from "../utilities/hashFunction";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sid = req.signedCookies?.sid;

    if (typeof sid !== "string" || !sid) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const [session] = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.token, hashFunction(sid)))
      .limit(1);

    if (!session) {
      res.clearCookie("sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        sameSite: "lax",
      });

      return res.status(401).json({
        message: "Invalid session. Please sign in again.",
      });
    }

    if (session.expiresAt <= new Date()) {
      await db.delete(sessionTable).where(eq(sessionTable.id, session.id));

      res.clearCookie("sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        sameSite: "lax",
      });

      return res.status(401).json({
        message: "Your session has expired. Please sign in again.",
      });
    }

    req.userId = session.userId;

    return next();
  } catch (error) {
    return next(error);
  }
};
