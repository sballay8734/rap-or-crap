import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { errorHandler } from "../utils/errorHandler"
import { successHandler } from "../utils/successHandler"
import { IUserResponse } from "../types/ServerAuthTypes"
import User from "../models/user"
import { fieldsAreNotValid, passwordsMatch } from "../helpers/authHelpers"
import { logServer } from "../helpers/logFormatter"

const SALT = Number(process.env.SALT)

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body)
  const { email, displayName, password, confirmPassword } = req.body

  // if a field is blank
  if (fieldsAreNotValid(email, displayName, password, confirmPassword)) {
    return next(errorHandler(400, "All fields are required."))
  }

  // if passwords don't match
  if (!passwordsMatch) {
    return next(errorHandler(400, "Passwords do not match."))
  }

  // if email already exists
  // !FIXME: Need to lowercase email!
  const existingUser = await User.findOne({ email })
  if (existingUser) return next(errorHandler(409, "That user already exists."))

  console.log("SALT:", process.env.SALT)

  try {
    const newUser = await User.create({
      email,
      displayName,
      password: bcrypt.hashSync(password, SALT!)
    })

    if (!newUser) return next(errorHandler(500, "Could not create user."))

    const userResponse: IUserResponse = {
      _id: newUser._id.toString(), // Convert ObjectId to string
      email: newUser.email,
      displayName: newUser.displayName,
      activeGameId: newUser.activeGameId || ""
    }

    const token = jwt.sign({ id: userResponse._id }, process.env.JWT_SECRET!)

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userResponse)
  } catch (error) {
    next(errorHandler(500, "Something went wrong."))
  }
}

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  try {
    const validUser = await User.findOne({ email })
    if (!validUser)
      return next(errorHandler(400, "Email or password is incorrect"))

    const validPassword = bcrypt.compareSync(password, validUser.password)
    if (!validPassword)
      return next(errorHandler(400, "Email or password is incorrect"))

    const userObject = validUser.toObject()

    const { password: pass, ...rest } = userObject

    const token = jwt.sign({ id: userObject._id }, process.env.JWT_SECRET!)

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest)
  } catch (error) {
    next(errorHandler(500, "Could not signin."))
  }
}

export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // return next(errorHandler(500, "TEST"))
    res.clearCookie("access_token")
    return successHandler(res, 200, "User has been logged out!", {})
  } catch (error) {
    next(errorHandler(500, "Failed to sign out user."))
  }
}
