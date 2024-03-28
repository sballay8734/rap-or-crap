import { Request, Response, NextFunction } from "express"
import { errorHandler } from "../utils/errorHandler"
import Game from "../models/gameInstance"
import User from "../models/user"
import { logServer, warnServer } from "../helpers/logFormatter"
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
      // logServer("Game found and deleted")
    }

    // gets a random lyric to initialize game with
    const randomPrompt = await Prompt.aggregate().sample(1)
    if (!randomPrompt)
      return next(errorHandler(400, "Could not find random lyric."))

    const { lyric, _id } = randomPrompt[0]

    const finalizedGameData = {
      playersObject: gameData.playersObject,
      userId: gameData.userId,
      currentLyric: lyric,
      currentPromptId: _id.valueOf()
    }

    // Creates game with finializedGameData
    const newGame = await Game.create(finalizedGameData)
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

// TODO: ENDPOINT HIT (NOW GO THROUGH THE GREEN NOTES AND IMPLEMENT)
// THIS IS CURRENTLY ERRORING

export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logServer(req.body)

  const answersObject = req.body.answersObject
  const gameId = req.body.gameId
  const promptId = req.body.promptId

  if (!promptId || promptId === "") {
    return next(errorHandler(400, "No active game."))
  }
  if (!gameId || gameId === "") {
    return next(errorHandler(400, "No active game."))
  }
  if (!answersObject || Object.keys(answersObject).length === 0) {
    return next(errorHandler(400, "Something went wrong submitting answers."))
  }

  try {
    // * Grab Game
    const gameToUpdate = await Game.findById(gameId)
    if (gameToUpdate === null) {
      return next(errorHandler(400, "Game not found."))
    }
    // * Grab Prompt
    const promptToCompare = await Prompt.findById(promptId)
    if (promptToCompare === null) {
      return next(errorHandler(400, "Game not found."))
    }
    // * Compare Answers
    const correctAnswer = promptToCompare.correctAnswer

    for (const [key, value] of Object.entries(answersObject)) {
      // TODO: Update total number of skips also (1 or 2 per game)
      if (value === "skip") continue

      if (value === correctAnswer) {
        gameToUpdate.playersObject[key].cCorrect += 1
        gameToUpdate.playersObject[key].cCorrectStreak += 1
        // reset wrong streak on correct answer
        gameToUpdate.playersObject[key].cWrongStreak = 0
      } else {
        gameToUpdate.playersObject[key].cWrong += 1
        gameToUpdate.playersObject[key].cWrongStreak += 1
        // reset correct streak on wrong answer
        gameToUpdate.playersObject[key].cCorrectStreak = 0
      }
    }

    // * Update Game
    const updatedGame = await gameToUpdate.save()

    if (!updatedGame) return next(errorHandler(500, "Could not save game."))

    return res.status(200).json(updatedGame)
  } catch (error) {
    next(errorHandler(500, "Something went wrong updating the game."))
  }
}
