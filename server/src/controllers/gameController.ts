import { Request, Response, NextFunction } from "express"
import { errorHandler } from "../utils/errorHandler"
import Game from "../models/gameInstance"
import User from "../models/user"

export const initializeGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("USER ID", req.userId)
  return res.status(200).json("FINALLY")
  const gameData = req.body

  try {
    // first, create game
    const newGame = await Game.create(gameData)
    if (!newGame) next(errorHandler(400, "Could not initialize game."))

    // second, get gameId and set users active game to that id
    // const userToUpdate = await User.findByIdAndUpdate(userId, {
    //   activeGameId: newGame._id
    // })
    // if (!userToUpdate)
    //   return next(
    //     errorHandler(400, "Game created but could not update active game")
    //   )

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
  console.log("FETCHING GAME!")
  // return next(errorHandler(500, "Custom Error."))

  return res.status(200).json({
    _id: "TEST_TEST_TEST",
    userId: "TEST_USER_ID",
    gameStartDate: "DATE",
    playersObject: {
      Steve: {
        cCorrect: 0,
        cWrong: 0,
        cDrinksTaken: 0,
        cDrinksGiven: 0,
        cCorrectStreak: 0,
        cWrongStreak: 0
      },
      Shawn: {
        cCorrect: 0,
        cWrong: 0,
        cDrinksTaken: 0,
        cDrinksGiven: 0,
        cCorrectStreak: 0,
        cWrongStreak: 0
      },
      Dave: {
        cCorrect: 0,
        cWrong: 0,
        cDrinksTaken: 0,
        cDrinksGiven: 0,
        cCorrectStreak: 0,
        cWrongStreak: 0
      }
    }
  })
  // const userId = req.userId
  // 2. Grab id of game from user activeGame.
  // 3. Fetch and return game.
}
