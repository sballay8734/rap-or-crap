import { Request, Response, NextFunction } from "express"
import { errorHandler } from "../utils/errorHandler"
import Game from "../models/gameInstance"
import User from "../models/user"
import { logServer } from "../helpers/logFormatter"
import Prompt from "../models/prompt"

interface PlayerStats {
  cCorrect: number
  cWrong: number
  cDrinksTaken: number
  cDrinksGiven: number
  cCorrectStreak: number
  cWrongStreak: number
}

export interface PlayersObject {
  [playerName: string]: PlayerStats
}

export interface IGameInstance {
  _id?: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate?: string
  playersObject: PlayersObject
  currentLyric: string
}

export const initializeGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const gameData: IGameInstance = req.body
  const userId = req.userId

  try {
    // Check user exists
    const userToUpdate = await User.findById(userId)

    if (userToUpdate === null) {
      return next(errorHandler(400, "User not found."))
    }

    // deletes old game if one existed
    if (userToUpdate.activeGameId !== "") {
      const gameId = userToUpdate.activeGameId
      const deletedGame = await Game.findByIdAndDelete(gameId)
      logServer("Game found and deleted", deletedGame)
    }

    // gets a random lyric to initialize game with
    const randomLyric = await Prompt.aggregate().sample(1)
    if (!randomLyric)
      return next(errorHandler(400, "Could not find random lyric."))

    const { lyric, _id } = randomLyric[0]

    const finalizedGameData = {
      playersObject: gameData.playersObject,
      userId: gameData.userId,
      currentLyric: lyric,
      currentPromptId: _id
    }

    // Creates game with finializedGameData
    const newGame = await Game.create(finalizedGameData)
    if (!newGame) next(errorHandler(400, "Could not initialize game."))

    // third, get gameId and set users active game to that id
    userToUpdate.activeGameId = newGame._id

    await userToUpdate.save()

    logServer("Game initialized", newGame)

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

  if (!userId) return next(errorHandler(401, "Unauthorized."))

  const user = await User.findById(userId)

  if (user === null) return next(errorHandler(400, "User not found."))

  const activeGameId = user.activeGameId
  if (activeGameId === "") {
    return res.status(200).json(null)
  }

  const activeGame = await Game.findById(activeGameId)
  if (activeGame === null) {
    logServer("gameController/fetchActiveGame", activeGame)
    return res.status(200).json(null)
  }

  return res.status(200).json(activeGame)
}

export const deleteOldActiveGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId

  if (!userId) return next(errorHandler(401, "Unauthorized."))

  const user = await User.findById(userId)

  if (user === null) return next(errorHandler(400, "User not found."))

  const activeGameId = user.activeGameId
  if (activeGameId === "") {
    return next(errorHandler(400, "No active game."))
  }

  const deletedGame = await Game.findByIdAndDelete(activeGameId)
  if (deletedGame === null) {
    return next(errorHandler(400, "Game not found."))
  }

  const updatedUser = await User.findByIdAndUpdate(userId, {
    activeGameId: ""
  })
  if (!updatedUser) {
    return next(
      errorHandler(400, "Game deleted, but user could not be updated.")
    )
  }

  logServer("User updated successfully")

  return res.status(200).json(null)
}

// ! Don't send correct answer back when fetching prompts... Minor for this use case but could be very important security consideration for another app
// ! ACTUALLY: ONLY send the lyric
export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId
  const gameId = req.body.gameId
  const promptId = req.body.promptId
  const answersObject = req.body.answers

  // * Grab prompt
  if (!promptId || promptId === "") {
    return next(errorHandler(400, "No active game."))
  }

  const promptToCompare = await Prompt.findById(promptId)
  if (promptToCompare === null) {
    return next(errorHandler(400, "Game not found."))
  }

  if (!gameId || gameId === "") {
    return next(errorHandler(400, "No active game."))
  }
  // * Compare Answers ********************************************

  // * Grab Game
  const gameToUpdate = await Game.findById(gameId)
  if (gameToUpdate === null) {
    return next(errorHandler(400, "Game not found."))
  }

  // * Update Game
  return
  const updatedUser = await User.findByIdAndUpdate(userId, {
    activeGameId: ""
  })
  if (!updatedUser) {
    return next(
      errorHandler(400, "Game deleted, but user could not be updated.")
    )
  }

  return res.status(200).json(null)
}
