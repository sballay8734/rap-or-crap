// TODO: Use a music database to look up the songs and add them that way. This will make it easier to check for a duplicate song before submitting

import mongoose, { Schema } from "mongoose"

interface IPrompt {
  artistName: string | null
  lyric: string
  youtubeUrl: string | null
  correctAnswer: "rap" | "crap"
}

const PromptSchema = new Schema({
  artistName: String,
  lyric: String,
  youtubeUrl: String,
  correctAnswer: String
})

const Prompt = mongoose.model<IPrompt>("prompt", PromptSchema)

export default Prompt
