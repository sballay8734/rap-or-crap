import mongoose, { Schema, Document } from "mongoose"

import { PlayerStats } from "../types/ServerDataTypes"

interface IGameInstance extends Document {
  _id?: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate?: string
  playersObject: Map<string, PlayerStats>
  currentLyric: string
  currentPromptId: string
  currentRound: number
  seenPromptIds: string[]
}

interface History {
  [key: string]: boolean
}

const PlayerStatsSchema = new Schema<PlayerStats>({
  cCorrect: { type: Number, default: 0 },
  cWrong: { type: Number, default: 0 },
  cDrinksTaken: { type: Number, default: 0 },
  cDrinksGiven: { type: Number, default: 0 },
  cCorrectStreak: { type: Number, default: 0 },
  cWrongStreak: { type: Number, default: 0 },
  lastQSkipped: { type: Boolean },
  lastQCorrect: { type: Boolean },
  history: { type: Schema.Types.Mixed }
})

const GameInstanceSchema = new Schema({
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
  currentPromptId: { type: String },
  currentRound: { type: Number },
  seenPromptIds: { type: [String] }
})

const Game = mongoose.model<IGameInstance>("game", GameInstanceSchema)

export default Game
