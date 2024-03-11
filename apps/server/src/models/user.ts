import mongoose, { Schema } from "mongoose";

interface IUser {
  email: string;
  displayName: string;
  password: string;
  activeGameId: string;

  // TODO: should be an array of IDs
  friends?: string[];
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  password: { type: String, required: true },
  activeGameId: { type: String, default: "" },
});

const User = mongoose.model<IUser>("user", UserSchema);

export default User;
