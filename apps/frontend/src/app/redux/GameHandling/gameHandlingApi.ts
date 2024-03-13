import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface PlayerStats {
  cCorrect: number;
  cWrong: number;
  cDrinksTaken: number;
  cDrinksGiven: number;
  cCorrectStreak: number;
  cWrongStreak: number;
}

export interface PlayersObject {
  [playerName: string]: PlayerStats;
}

export interface IGameInstance {
  _id?: string; // created by mongoDB
  userId: string; // the signed in user who initialized the game
  gameStartDate: string;
  playersObject: PlayersObject;
}

const gameHandlingApi = createApi({
  reducerPath: "gameHandlingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/api/game/" }),
  endpoints: (builder) => ({
    // first is response, second is req obj
    lazyInitializeGame: builder.mutation<IGameInstance, IGameInstance>({
      query: (body) => ({ url: "initialize-game", method: "POST", body }),
    }),
  }),
});

// ! FIXME: Ideally this should not be "any" but as of now it prevents TS error
export const { useLazyInitializeGameMutation } = gameHandlingApi as any;
export { gameHandlingApi };
