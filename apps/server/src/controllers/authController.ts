import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { errorHandler } from "../utils/errorHandler";
import { successHandler } from "../utils/successHandler";
import { IUserResponse } from "../types/authTypes";
import User from "../models/user";
import { fieldsAreNotValid, passwordsMatch } from "../helpers/authHelpers";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, displayName, password, confirmPassword } = req.body;

  // if a field is blank
  if (fieldsAreNotValid(email, displayName, password, confirmPassword)) {
    return next(errorHandler(400, "All fields are required."));
  }

  // if passwords don't match
  if (!passwordsMatch) {
    return next(errorHandler(400, "Passwords do not match."));
  }

  // if email already exists
  // !FIXME: Need to lowercase email!
  const existingUser = await User.findOne({ email });
  console.log(existingUser);
  if (existingUser)
    return next(errorHandler(409, "That email already exists."));

  try {
    const newUser = await User.create({
      email,
      displayName,
      // !TODO: Move salt value to dotenv file
      password: bcrypt.hashSync(password, 13),
    });

    if (!newUser) return next(errorHandler(500, "Could not create user."));

    const userResponse: IUserResponse = {
      _id: newUser._id.toString(), // Convert ObjectId to string
      email: newUser.email,
      displayName: newUser.displayName,
      activeGameId: newUser.activeGameId || "",
    };

    return successHandler<IUserResponse>(
      res,
      200,
      "Account creation successful!",
      userResponse,
    );
  } catch (error) {
    next(errorHandler(500, "Something went wrong."));
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const formData = req.body;
  console.log("HIT SIGNIN");
  return res.status(200).json(formData);
};
