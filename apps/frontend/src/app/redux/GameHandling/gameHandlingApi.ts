import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setResponseMessage } from "../serverResponseSlice";

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

export const gameHandlingApi = createApi({
  reducerPath: "gameHandlingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/api/game/" }),
  tagTypes: ["ActiveGame"],
  endpoints: (builder) => ({
    // first is response, second is req obj
    lazyFetchActiveGame: builder.query<IGameInstance, void>({
      query: () => "active-game",
      providesTags: ["ActiveGame"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(
            setResponseMessage({
              successResult: false,
              message: "An error occured while trying to find active game.",
            }),
          );
        }
      },
    }),
    initializeGame: builder.mutation<IGameInstance, IGameInstance>({
      query: (body) => ({ url: "initialize-game", method: "POST", body }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(
            setResponseMessage({
              successResult: false,
              message: "An error occured while trying to start the game.",
            }),
          );
        }
      },
    }),
  }),
});

// ! FIXME: Ideally this should not be "any" but as of now it prevents TS error
export const { useInitializeGameMutation, useLazyFetchActiveGameQuery } =
  gameHandlingApi as any;
