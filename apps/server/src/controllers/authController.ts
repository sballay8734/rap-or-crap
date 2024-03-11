import { Request, Response, NextFunction } from "express";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const formData = req.body;
  console.log("HIT SIGNUP");
  return res.status(200).json(formData);
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
