import mongoose, { Schema, Document } from "mongoose"

export interface PlayerStats {
  cCorrect: number
  cWrong: number
  cDrinksTaken: number
  cDrinksGiven: number
  cCorrectStreak: number
  cWrongStreak: number
  lastQCorrect: boolean
}

// interface PlayersObject {
//   [playerName: string]: PlayerStats
// }

interface IGameInstance extends Document {
  _id?: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate?: string
  playersObject: Map<string, PlayerStats>
  currentLyric: string
  currentPromptId: string
}

const PlayerStatsSchema = new Schema<PlayerStats>({
  cCorrect: { type: Number, default: 0 },
  cWrong: { type: Number, default: 0 },
  cDrinksTaken: { type: Number, default: 0 },
  cDrinksGiven: { type: Number, default: 0 },
  cCorrectStreak: { type: Number, default: 0 },
  cWrongStreak: { type: Number, default: 0 },
  lastQCorrect: { type: Boolean }
})

const GameInstanceSchema = new Schema({
  // Use the game instance to continue game rather than dealing with local storage.
  // you can have an "active game" field for each user. When they select new game, you clear this field and replace it with the new one.
  // Delete the game instance when a new one is created
  userId: { type: String, required: true },
  gameStartDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  playersObject: {
    type: Map,
    of: PlayerStatsSchema,
    required: true,
    default: new Map<string, PlayerStats>()
  },
  currentLyric: { type: String },
  currentPromptId: { type: String }
})

const Game = mongoose.model<IGameInstance>("game", GameInstanceSchema)

export default Game
