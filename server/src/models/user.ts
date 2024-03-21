import mongoose, { Schema } from "mongoose";
import { IUserRequest } from "../types/authTypes";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  password: { type: String, required: true },
  activeGameId: { type: String, default: "" },
});

const User = mongoose.model<IUserRequest>("user", UserSchema);

export default User;
