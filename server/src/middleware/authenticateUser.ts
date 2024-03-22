import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import { errorHandler } from "../utils/errorHandler"

// ! Ideally you would declare this in express.d.ts but I think the compilation is messed up and this file is compiling before express.d.ts causing it not to work unless it's declared here.

declare global {
  namespace Express {
    interface Request {
      userId?: JwtPayload
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token

  if (!token) return next(errorHandler(401, "Unauthorized"))

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)

    if (typeof decoded === "string") {
      return next(errorHandler(400, "Invalid token"))
    }
    if ("id" in decoded) {
      req.userId = decoded.id
      return next()
    }
  } catch (error) {
    next(errorHandler(400, "Could not authenticate user."))
  }
}
