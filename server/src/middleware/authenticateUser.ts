import { NextFunction, Request, Response } from "express"
import jwt, { VerifyErrors } from "jsonwebtoken"

import { errorHandler } from "../utils/errorHandler"

interface UserIdInRequest extends Request {
  userId: string
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token
    console.error("TOKEN", token)

    if (!token) return next(errorHandler(401, "Unauthorized"))

    jwt.verify(
      token,
      process.env.JWT_SECRET!,
      (err: VerifyErrors | null, user: any) => {
        if (err) return next(errorHandler(403, "Forbidden"))

        console.error(user)
        // req.userId = user._id
        next()
      }
    )
  } catch (error) {
    next(errorHandler(400, "Could not authenticate user."))
  }
}
