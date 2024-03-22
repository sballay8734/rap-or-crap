import { Request, Response, NextFunction } from "express"
import { errorHandler } from "../utils/errorHandler"
import Game from "../models/gameInstance"
import User from "../models/user"

export const initializeGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const gameData = req.body
  const userId = req.userId

  try {
    // first see if user exists
    const userToUpdate = await User.findById(userId)
    console.log(userToUpdate)
    if (userToUpdate === null) {
      return next(errorHandler(400, "User not found."))
    }
    // second, create game
    const newGame = await Game.create(gameData)
    if (!newGame) next(errorHandler(400, "Could not initialize game."))

    // third, get gameId and set users active game to that id
    userToUpdate.activeGameId = newGame._id

    await userToUpdate.save()

    return res.status(200).json(newGame)
  } catch (error) {
    next(errorHandler(500, "Could not initialize game."))
  }
}

export const fetchActiveGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId
  console.log("USER ID:", userId)

  if (!userId) return next(errorHandler(401, "Unauthorized."))

  const user = await User.findById(userId)

  if (user === null) return next(errorHandler(400, "User not found."))

  const activeGameId = user.activeGameId
  console.log("GAME ID:", activeGameId)
  if (activeGameId === "") {
    return next(errorHandler(400, "No active game."))
  }

  const activeGame = await Game.findById(activeGameId)
  if (activeGame === null) {
    console.log("ACTIVE GAME", activeGame)
    return next(errorHandler(400, "Game not found."))
  }

  return res.status(200).json(activeGame)
}
