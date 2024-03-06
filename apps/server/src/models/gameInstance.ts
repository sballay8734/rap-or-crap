import mongoose, { Schema } from "mongoose";

interface IGameInstance {
  playerIds: string[];
}

const GameInstanceSchema = new Schema({
  // Use the game instance to continue game rather than dealing with local storage.
  // you can have an "active game" field for each user. When they select new game, you clear this field and replace it with the new one.
  // Delete the game instance when a new one is created
});

const Game = mongoose.model<IGameInstance>("game", GameInstanceSchema);

export default Game;
