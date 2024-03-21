import mongoose, { Schema } from "mongoose"

interface IPrompt {
  artistName: string | null
  lyric: string
  youtubeUrl: string
}

const PromptSchema = new Schema({
  artistName: String,
  lyric: String,
  youtubeUrl: String
})

const Prompt = mongoose.model<IPrompt>("prompt", PromptSchema)

export default Prompt
