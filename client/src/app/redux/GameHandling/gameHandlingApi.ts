import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setResponseMessage } from "../serverResponseSlice"
import { isCustomApiResponse } from "../../helpers/errorReform"
import { errorClient, logClient, warnClient } from "../../helpers/logFormatter"
import { PlayerSelections } from "../../pages/GamePage"

interface PlayerStats {
  cCorrect: number
  cWrong: number
  cDrinksTaken: number
  cDrinksGiven: number
  cCorrectStreak: number
  cWrongStreak: number
}

export interface PlayersObject {
  [playerName: string]: PlayerStats
}

export interface IGameInstance {
  _id?: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate?: string
  playersObject: PlayersObject
}

export interface InitializedGameInstance {
  _id: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate: string
  playersObject: PlayersObject
  currentLyric: string
  currentPromptId: string
}

export interface UpdateGameStateProps {
  answersObject: PlayerSelections
  gameId: string
  promptId: string
}

// ! NOTE: Manually triggered queries must be of type "lazy" while manually triggered mutations do not

export const gameHandlingApi = createApi({
  reducerPath: "gameHandlingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api/game/",
    credentials: "include"
  }),
  tagTypes: ["ActiveGame"],
  endpoints: (builder) => ({
    // first is response, second is req obj
    fetchActiveGame: builder.query<InitializedGameInstance, void>({
      query: () => "active-game",
      providesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled
          if (res.data === null) return
        } catch (err) {
          if (isCustomApiResponse(err)) {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: err.error.data.message
              })
            )
          } else {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: "Something went wrong searching for an active game."
              })
            )
          }
        }
      }
    }),
    deleteGame: builder.mutation<IGameInstance | null, void>({
      query: () => ({ url: "delete-game", method: "DELETE" }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (err) {
          if (isCustomApiResponse(err)) {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: err.error.data.message
              })
            )
          } else {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: "Something went wrong searching for an active game."
              })
            )
          }
        }
      }
    }),
    // Initialize new game AND overwrite "active game" with new id
    initializeGame: builder.mutation<InitializedGameInstance, IGameInstance>({
      query: (body) => ({ url: "initialize-game", method: "POST", body }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled
          logClient("gameHandlingApi/initialize-game", res)
          // if ("data" in res) {
          //   const gameId = res.data?._id ?? "No ID found"
          //   if (gameId !== "No ID found") {
          //     dispatch(setUserActiveGame(gameId))
          //   }
          // }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: err.error.data.message
              })
            )
          } else {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: "Something went wrong searching for an active game."
              })
            )
          }
        }
      }
    }),
    updateGameState: builder.mutation<
      InitializedGameInstance,
      UpdateGameStateProps
    >({
      query: (body) => ({ url: "update-game", method: "PATCH", body }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled
          if ("data" in res) {
            logClient("Successful game update. Showing modal...")
            // dispatch result modal
          }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: err.error.data.message
              })
            )
          } else {
            dispatch(
              setResponseMessage({
                successResult: false,
                message: "Something went wrong updating the game."
              })
            )
          }
        }
      }
    })
  })
})

export const {
  useInitializeGameMutation,
  useFetchActiveGameQuery,
  useDeleteGameMutation,
  useUpdateGameStateMutation
} = gameHandlingApi
