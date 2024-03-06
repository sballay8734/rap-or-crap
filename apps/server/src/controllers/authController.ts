import { Request, Response, NextFunction } from "express";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("HIT SIGNUP");
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("HIT LOGIN");
};
