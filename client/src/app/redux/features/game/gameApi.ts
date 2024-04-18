import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { isCustomApiResponse } from "../../../helpers/errorReform"
import { showResultModal } from "../modals/resultModalSlice"
import { modalCascade } from "../../utils/apiUtils"
import {
  IGameInstance,
  InitializedGameInstance,
  Results,
  UpdateGameStateProps
} from "../../../../types/ClientDataTypes"
import { removeModal } from "../modals/handleModalsSlice"
import { DEPLOYMENT_URL } from "../../../../config/url"

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${DEPLOYMENT_URL}/api/game/`,
    credentials: "include"
  }),
  tagTypes: ["ActiveGame"],
  endpoints: (builder) => ({
    fetchActiveGame: builder.query<InitializedGameInstance, "skip" | "run">({
      query: () => "active-game",
      providesTags: ["ActiveGame"],
      async onQueryStarted(flag, { dispatch, queryFulfilled }) {
        const modalId = "fetchActiveGame"

        if (flag === "skip") {
          dispatch(removeModal(modalId))
          return
        }

        modalCascade().start(dispatch, true, modalId)

        try {
          const res = await queryFulfilled
          if (res.data === null) {
            // if no active game, handle success silently
            modalCascade().endWithSuccess(dispatch, false, modalId)
          } else {
            // notify "Existing game found!"
            modalCascade().endWithSuccess(dispatch, true, modalId)
          }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            const errorMsg = err.error.data.message
            modalCascade().endWithError(dispatch, true, modalId, errorMsg)
          } else {
            modalCascade().endWithError(dispatch, false, modalId)
          }
        }
      }
    }),
    deleteGame: builder.mutation<IGameInstance | null, void>({
      query: () => ({ url: "delete-game", method: "DELETE" }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const modalId = "deleteGame"

        modalCascade().start(dispatch, true, modalId)

        try {
          await queryFulfilled
          modalCascade().endWithSuccess(dispatch, true, modalId)
        } catch (err) {
          if (isCustomApiResponse(err)) {
            const errorMsg = err.error.data.message
            modalCascade().endWithError(dispatch, true, modalId, errorMsg)
          } else {
            modalCascade().endWithError(dispatch, false, modalId)
          }
        }
      }
    }),
    // Initialize new game AND overwrite "active game" with new id
    initializeGame: builder.mutation<InitializedGameInstance, IGameInstance>({
      query: (body) => ({ url: "initialize-game", method: "POST", body }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const modalId = "initializeGame"

        modalCascade().start(dispatch, true, modalId)

        try {
          const newGame = await queryFulfilled
          if ("data" in newGame) {
            modalCascade().endWithSuccess(dispatch, true, modalId)
            dispatch(
              gameApi.util.upsertQueryData(
                "fetchActiveGame",
                "skip",
                newGame.data
              )
            )
          }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            const errorMsg = err.error.data.message
            modalCascade().endWithError(dispatch, true, modalId, errorMsg)
          } else {
            modalCascade().endWithError(dispatch, false, modalId)
          }
        }
      }
    }),
    updateGameState: builder.mutation<Results, UpdateGameStateProps>({
      query: (body) => ({ url: "update-game", method: "PATCH", body }),
      invalidatesTags: ["ActiveGame"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const modalId = "updateGame"

        modalCascade().start(dispatch, true, modalId)

        try {
          const updatedGame = await queryFulfilled
          if ("data" in updatedGame) {
            modalCascade().endWithSuccess(dispatch, false, modalId)
            dispatch(
              gameApi.util.upsertQueryData(
                "fetchActiveGame",
                "skip",
                updatedGame.data.game
              )
            )
            dispatch(
              showResultModal({
                game: updatedGame.data.game,
                completedPrompt: updatedGame.data.completedPrompt
              })
            )
          }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            const errorMsg = err.error.data.message
            modalCascade().endWithError(dispatch, true, modalId, errorMsg)
          } else {
            modalCascade().endWithError(dispatch, false, modalId)
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
        const modalId = "gettingNewLyric"

        modalCascade().start(dispatch, true, modalId)

        try {
          const updatedGame = await queryFulfilled
          if ("data" in updatedGame) {
            modalCascade().endWithSuccess(dispatch, false, modalId)
            dispatch(
              gameApi.util.upsertQueryData(
                "fetchActiveGame",
                "skip",
                updatedGame.data
              )
            )
          }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            const errorMsg = err.error.data.message
            modalCascade().endWithError(dispatch, true, modalId, errorMsg)
          } else {
            modalCascade().endWithError(dispatch, true, modalId)
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
// MINOR: logging out too quickly causes error (you've disabled the button while loading for now but might not be best)

// mTODO: Preload fonts, imgs, icons, etc

// mTODO: Add Nav to home on Game Page

// mTODO: Add functionality to "Rules" button
