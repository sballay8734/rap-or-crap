import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/errorHandler";
import Game from "../models/gameInstance";

export const initializeGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const gameData = req.body;

  try {
    const newGame = await Game.create(gameData);

    if (!newGame) next(errorHandler(400, "Could not initialize game."));

    return res.status(200).json(newGame);
  } catch (error) {
    next(errorHandler(500, "Could not initialize game."));
  }
};

export const fetchActiveGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Fetching active game...");
  // 1. Verify user.
  // 2. Grab id of game from user activeGame.
  // 3. Fetch and return game.
};
