import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  if (existingUser) return next(errorHandler(409, "That user already exists."));

  try {
    const newUser = await User.create({
      email,
      displayName,
      // TODO: Move salt value to dotenv file
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
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser)
      return next(errorHandler(400, "Email or password is incorrect"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(400, "Email or password is incorrect"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET!);

    const userObject = validUser.toObject();

    const { password: pass, ...rest } = userObject;

    res.cookie("access_token", token, { httpOnly: true });
    return successHandler(res, 200, "Sign in successful!", rest);
  } catch (error) {
    next(errorHandler(500, "Could not signin."));
  }
};

export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("access_token");
    return successHandler(res, 200, "User has been logged out!", {});
  } catch (error) {
    next(errorHandler(500, "Failed to sign out user."));
  }
};
