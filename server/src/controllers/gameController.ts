import { Request, Response, NextFunction } from "express"

import { errorHandler } from "../utils/errorHandler"
import Game from "../models/gameInstance"
import User from "../models/user"
import { logServer, warnServer } from "../helpers/logFormatter"
import Prompt from "../models/prompt"
import { IGameInstance } from "../types/ServerDataTypes"
import mongoose from "mongoose"

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
      currentRound: 1,
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

  return res.status(200).json(null)
}

// ! Don't send correct answer back when fetching prompts... Minor for this use case but could be very important security consideration for another app
// ! ACTUALLY: ONLY send the lyric

export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const currentRound = gameToUpdate.currentRound.toString()

    // Flatten the playersObject map
    const flattenedPlayersObject = Object.fromEntries(
      gameToUpdate.playersObject
    )

    for (const [key, value] of Object.entries(answersObject)) {
      // Update each player
      const playerData = flattenedPlayersObject[key]
      if (!playerData) return // SHOULD always exist (initialized with game)

      if (value === "skip") {
        playerData.lastQSkipped = true
        playerData.lastQCorrect = false
      } else if (value === correctAnswer) {
        // They got it right
        playerData.cCorrect += 1
        playerData.cCorrectStreak += 1
        playerData.lastQCorrect = true
        playerData.lastQSkipped = false
        playerData.history[currentRound] = true
        // reset wrong streak on correct answer
        playerData.cWrongStreak = 0
      } else {
        // They got it wrong
        playerData.cWrong += 1
        playerData.cWrongStreak += 1
        playerData.lastQCorrect = false
        playerData.lastQSkipped = false
        playerData.history[currentRound] = false
        // reset correct streak on wrong answer
        playerData.cCorrectStreak = 0
      }
      flattenedPlayersObject[key] = playerData
    }

    // Update the playersObject with the flattened object
    gameToUpdate.playersObject = new Map(Object.entries(flattenedPlayersObject))

    // ! add promptId to list of "seen" prompts
    gameToUpdate.seenPromptIds.push(promptId)

    // * Update Game
    const updatedGame = await gameToUpdate.save()

    if (!updatedGame) return next(errorHandler(500, "Could not save game."))

    return res
      .status(200)
      .json({ game: updatedGame, completedPrompt: promptToCompare })
  } catch (error) {
    next(errorHandler(500, "Something went wrong updating the game."))
  }
}

export const getNewPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const gameId = req.params.gameId

  // * get game
  const currentGame = await Game.findById(gameId)
  if (!currentGame) return next(errorHandler(400, "Game not found."))

  // * get a new prompt where the new promptId is not in seenPromptIds
  try {
    const seenPromptIds = currentGame.seenPromptIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    )
    const newPrompt = await Prompt.aggregate([
      { $match: { _id: { $nin: seenPromptIds } } },
      { $sample: { size: 1 } }
    ])

    if (newPrompt.length === 0) {
      logServer("No prompts remaining.")
      currentGame.currentLyric = "No more lyrics"
      currentGame.currentPromptId = ""

      await currentGame.save()

      return res.status(200).json(currentGame)
    }

    const { lyric, _id } = newPrompt[0]

    // * update gameInstance (currentLyric, currentPromptId, round)
    currentGame.currentLyric = lyric
    currentGame.currentPromptId = _id
    currentGame.currentRound += 1

    await currentGame.save()

    return res.status(200).json(currentGame)
  } catch (error) {
    next(
      errorHandler(
        500,
        "Something weird happened while trying to get a new prompt."
      )
    )
  }
}
