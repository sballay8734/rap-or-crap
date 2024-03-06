import mongoose, { Schema } from "mongoose";

interface IUser {
  artistName: string | null;
  lyric: string;
  youtubeUrl: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true },
  displayName: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>("user", UserSchema);

export default User;
