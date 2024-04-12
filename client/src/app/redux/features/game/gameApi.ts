import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { isCustomApiResponse } from "../../../helpers/errorReform"
import { showResultModal } from "../modals/resultModalSlice"

import { hideLoadingModal, showLoadingModal } from "../modals/loadingModalSlice"
import {
  handleErrorAndNotify,
  handleSuccessAndNotify,
  handleSuccessSilently,
  modalCascade
} from "../../utils/apiUtils"
import { initializeModal, removeModal } from "../modals/handleModalsSlice"
import { setLocalGameId } from "./gameSlice"
import {
  FetchGameArgs,
  IGameInstance,
  InitializedGameInstance,
  UpdateGameStateProps
} from "../../../../types/ClientDataTypes"

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
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const modalId = "fetchActiveGame"
        const { gameId, flag } = args ?? { gameId: null, flag: "skip" }
        if (flag === "skip") return

        modalCascade().start(dispatch, true, modalId)

        try {
          const res = await queryFulfilled
          // if there is no active game, handle success silently
          if (res.data === null) {
            modalCascade().endWithSuccess(dispatch, false, modalId)
          } else if (res.data._id !== gameId) {
            // if DB _id !== localId -> it is first fetch ("Game found")
            modalCascade().endWithSuccess(dispatch, true, modalId)
            dispatch(setLocalGameId(res.data._id))
          } else {
            // if DB _id === localId -> game was already fetched
            modalCascade().endWithSuccess(dispatch, false, modalId)
          }
          // need to remove modal here also
          dispatch(removeModal("fetchActiveGame"))
        } catch (err) {
          if (isCustomApiResponse(err)) {
            const errorMsg = err.error.data.message
            modalCascade().endWithError(dispatch, false, modalId, errorMsg)
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
              gameApi.util.upsertQueryData(
                "fetchActiveGame",
                { gameId: null, flag: "skip" },
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
        dispatch(showLoadingModal("Checking your answers..."))
        try {
          const updatedGame = await queryFulfilled
          if ("data" in updatedGame) {
            dispatch(hideLoadingModal())
            dispatch(
              gameApi.util.upsertQueryData(
                "fetchActiveGame",
                { gameId: null, flag: "skip" },
                updatedGame.data
              )
            )
            dispatch(showResultModal(updatedGame.data))
          }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            handleErrorAndNotify(dispatch, err.error.data.message)
          } else {
            handleErrorAndNotify(dispatch, "Something went wrong.")
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
        dispatch(showLoadingModal("Getting new lyric..."))
        try {
          const updatedGame = await queryFulfilled
          if ("data" in updatedGame) {
            dispatch(hideLoadingModal())
            dispatch(
              gameApi.util.upsertQueryData(
                "fetchActiveGame",
                { gameId: null, flag: "skip" },
                updatedGame.data
              )
            )
          }
        } catch (err) {
          if (isCustomApiResponse(err)) {
            handleErrorAndNotify(dispatch, err.error.data.message)
          } else {
            handleErrorAndNotify(dispatch, "Something went wrong.")
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

// MINOR: Start button needs to be preloaded

// MINOR: Style resultModal

// MINOR: Style Scoreboard

// MINOR: Style Game Setup Page

// MINOR: Style Game Page

// MINOR: Add Nav to home on Game Page

// MINOR: RAP OR CRAP LOGO

// MINOR: Dark mode warning modal (confirmModal)

// MINOR: Add functionality to "Rules" button
