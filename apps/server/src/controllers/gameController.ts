import { Request, Response, NextFunction } from "express";

export const initializeGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const gameData = req.body;
  console.log(gameData);
  console.log("HIT INITIALIZE");
  return res.status(200).json(gameData);
};
