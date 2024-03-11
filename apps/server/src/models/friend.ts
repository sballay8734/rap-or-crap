import mongoose, { Schema } from "mongoose";

interface IFriend {
  // current game
  cCorrect: number;
  cWrong: number;
  cDrinksTaken: number;
  cDrinksGiven: number;
  cCorrectStreak: number;
  cWrongStreak: number;
  // lifetime
  lCorrect: number;
  lWrong: number;
  lDrinksTaken: number;
  lDrinksGiven: number;
  lCorrectStreak: number;
  lWrongStreak: number;
  // root friend
  rootFriendId: string;
}

const FriendSchema = new Schema({
  // Match to interface
});

const Friend = mongoose.model<IFriend>("friend", FriendSchema);

export default Friend;
