import { NextFunction, Request, Response } from "express";
import Prompt from "../models/prompt";

export const createPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const prompt = req.body;

  try {
    const newPrompt = await Prompt.create(prompt);

    if (!newPrompt) return res.status(500).json("Something went wrong!");

    return res.status(200).json(newPrompt);
  } catch (error) {
    next(error);
  }
};
