import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

import { errorHandler } from "../utils/errorHandler";

export const authenticateUser = async (
  req: Request & { user?: string },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify(
      token,
      process.env.JWT_SECRET!,
      (err: VerifyErrors | null, user: any) => {
        if (err) return next(errorHandler(403, "Forbidden"));

        console.log("AUTHENTICATED");
        req.user = user._id;
        next();
      },
    );
  } catch (error) {
    next(errorHandler(400, "Could not authenticate user."));
  }
};
