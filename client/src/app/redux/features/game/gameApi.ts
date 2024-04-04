import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setResponseMessage } from "../modals/responseModalSlice"
import { isCustomApiResponse } from "../../../helpers/errorReform"
import {
  errorClient,
  logClient,
  warnClient
} from "../../../helpers/logFormatter"
import { PlayerSelections } from "../../../pages/GamePage"
import { handleShowModal } from "../modals/resultModalSlice"
import { PlayerStats } from "../../../../types/ClientDataTypes"
import {
  hideFetchingModal,
  showFetchingModal
} from "../modals/fetchingModalSlice"
import { hideLoadingModal, showLoadingModal } from "../modals/loadingModalSlice"
import { handleSuccessAndNotify } from "../../utils/apiUtils"

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

// NOTE: Manually triggered queries must be of type "lazy" while manually triggered mutations do not
// TODO: Need to update all endpoints to use "showLoadingModal" and apiUtils
// TODO: Need to extract error logic like you did for authApi
export const gameApi = createApi({
  reducerPath: "gameApi",
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
        // BUG: This modal never disappears
        dispatch(showLoadingModal("Checking for existing game..."))
        try {
          const res = await queryFulfilled
          dispatch(hideLoadingModal())
          if (res.data === null) return // request was okay but no active game
          handleSuccessAndNotify(dispatch, "fetchActiveGame")
        } catch (err) {
          if (isCustomApiResponse(err)) {
            dispatch(hideFetchingModal())
            dispatch(
              setResponseMessage({
                successResult: false,
                message: err.error.data.message
              })
            )
          } else {
            dispatch(hideFetchingModal())
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
    // TODO: NOT DONE YET (NEITHER IS getNewPrompt endpoint in controller!!!)
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
          logClient("gameHandlingApi/get-new-prompt", res)
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
  useDeleteGameMutation,
  useUpdateGameStateMutation,
  useUpdateWithNewPromptMutation
} = gameApi
