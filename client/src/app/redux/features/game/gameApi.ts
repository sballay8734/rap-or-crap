// BUG: Difficult to pinpoint. When navigating to home after sign in, screen goes black for some reason. Any other time a modal is triggered this does not happen. Only when signing in

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { setResponseMessage } from "../modals/responseModalSlice"
import { isCustomApiResponse } from "../../../helpers/errorReform"
import { PlayerSelections } from "../../../pages/GamePage/GamePage"
import { handleShowModal } from "../modals/resultModalSlice"
import { PlayerStats } from "../../../../types/ClientDataTypes"
import { hideLoadingModal, showLoadingModal } from "../modals/loadingModalSlice"
import {
  handleErrorAndNotify,
  handleSuccessAndNotify,
  handleSuccessSilently
} from "../../utils/apiUtils"
import { initializeModal, removeModal } from "../modals/handleModalsSlice"
import { setLocalGameId } from "./gameSlice"

export interface PlayersObject {
  [playerName: string]: PlayerStats
}

export interface InitializedGameInstance {
  _id: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate: string
  playersObject: PlayersObject
  currentLyric: string
  currentPromptId: string
}

export interface IGameInstance {
  _id?: string // created by mongoDB
  userId: string // the signed in user who initialized the game
  gameStartDate?: string
  playersObject: PlayersObject
}

export interface UpdateGameStateProps {
  answersObject: PlayerSelections
  gameId: string
  promptId: string
}

interface FetchGameArgs {
  gameId: string | null
  flag: "skip" | "run"
}

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api/game/",
    credentials: "include"
  }),
  tagTypes: ["ActiveGame"],
  endpoints: (builder) => ({
    // if active game exists in state, the gameId will be passed as and argument
    fetchActiveGame: builder.query<InitializedGameInstance, FetchGameArgs>({
      query: () => "active-game",
      providesTags: ["ActiveGame"],
      // flag = skip
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const { gameId, flag } = args ?? { gameId: null, flag: "skip" }
        if (flag === "skip") return

        dispatch(showLoadingModal("Checking for existing game..."))
        dispatch(initializeModal("fetchActiveGame"))
        try {
          const res = await queryFulfilled
          // if there is no active game don't show "Existing game found!"
          if (res.data === null) {
            dispatch(hideLoadingModal())
            // need to remove modal here
            dispatch(removeModal("fetchActiveGame"))
            return
          }

          // if DB _id !== localId -> it is first fetch ("Game found")
          if (res.data._id !== gameId) {
            handleSuccessAndNotify(dispatch, "fetchActiveGame")
            dispatch(setLocalGameId(res.data._id))
            return
          }

          // if DB _id === localId -> game was already fetched
          handleSuccessSilently(dispatch)
          // need to remove modal here also
          dispatch(removeModal("fetchActiveGame"))
        } catch (err) {
          if (isCustomApiResponse(err)) {
            handleErrorAndNotify(dispatch, err.error.data.message)
            dispatch(removeModal("fetchActiveGame"))
          } else {
            handleErrorAndNotify(dispatch, "Something went wrong.")
            dispatch(removeModal("fetchActiveGame"))
          }
        }
      }
    }),
    deleteGame: builder.mutation<IGameInstance | null, void>({
      query: () => ({ url: "delete-game", method: "DELETE" }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(showLoadingModal("Deleting your old game..."))
        dispatch(initializeModal("deleteGame"))
        try {
          await queryFulfilled
          dispatch(hideLoadingModal())
          dispatch(removeModal("deleteGame"))
          handleSuccessAndNotify(dispatch, "deleteGame")
        } catch (err) {
          if (isCustomApiResponse(err)) {
            handleErrorAndNotify(dispatch, err.error.data.message)
          } else {
            handleErrorAndNotify(dispatch, "Something went wrong.")
          }
          dispatch(removeModal("deleteGame"))
        }
      }
    }),
    // Initialize new game AND overwrite "active game" with new id
    initializeGame: builder.mutation<InitializedGameInstance, IGameInstance>({
      query: (body) => ({ url: "initialize-game", method: "POST", body }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(showLoadingModal("Initializing a new game..."))
        dispatch(initializeModal("initializeGame"))
        try {
          const newGame = await queryFulfilled
          if ("data" in newGame) {
            dispatch(hideLoadingModal())
            dispatch(removeModal("initializeGame"))
            handleSuccessAndNotify(dispatch, "initializeGame")
            dispatch(
              gameApi.util.updateQueryData(
                "fetchActiveGame",
                { gameId: null, flag: "run" },
                newGame.data
              )
            )
          }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            handleErrorAndNotify(dispatch, err.error.data.message)
          } else {
            console.log("Hit error...")
            handleErrorAndNotify(dispatch, "Error initializing...")
          }
          dispatch(removeModal("initializeGame"))
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
          const updatedGame = await queryFulfilled
          if ("data" in updatedGame) {
            // pass the updatedGame to the modal to handle modal display
            dispatch(handleShowModal(updatedGame.data))
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
    }),
    updateWithNewPrompt: builder.mutation<InitializedGameInstance, string>({
      query: (gameId) => ({
        url: `get-new-prompt/${gameId}`,
        method: "PATCH",
        gameId
      }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled
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
    })
  })
})

export const {
  useInitializeGameMutation,
  useFetchActiveGameQuery,
  useLazyFetchActiveGameQuery,
  useDeleteGameMutation,
  useUpdateGameStateMutation,
  useUpdateWithNewPromptMutation
} = gameApi

// FIXME: START HERE *************************************
// FIXME: START HERE *************************************
// FIXME: START HERE *************************************
// FIXME: START HERE *************************************
// FIXME: Problems
// On log in
// ---- "existing game found" pops up twice on slow internet only (but actually doesn't happen on REALLY slow internet... weird but minor)
// ---- logging out too quickly causes error

// "unauthorized" still happening on logout

// Start button needs to be preloaded

// gameApi newGame.data error - Argument of type 'InitializedGameInstance' is not assignable to parameter of type 'Recipe<InitializedGameInstance>'.
