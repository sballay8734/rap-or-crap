import mongoose, { Schema } from "mongoose";

interface IFriend {
  currentGameCorrect: number;
  currentGameWrong: number;
  lifetimeCorrect: number;
  lifetimeWrong: number;
  drinksTaken: number;
  drinksGiven: number;
  longestCorrectStreak: number;
  longestWrongStreak: number;
  rootFriendId: string;
}

const FriendSchema = new Schema({
  // Match to interface
});

const Friend = mongoose.model<IFriend>("friend", FriendSchema);

export default Friend;
