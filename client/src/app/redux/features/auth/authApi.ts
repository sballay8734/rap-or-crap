// FIXME: According to redux documentation, you should only have ONE createApi call per application. You need to refactor your store config

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  SignInFormData,
  SignUpFormData
} from "../../../../types/ClientAuthTypes"
import { CreatedUser } from "../../../../types/responsesFromServer"
import { isCustomApiResponse } from "../../../helpers/errorReform"
import { hideLoadingModal, showLoadingModal } from "../modals/loadingModalSlice"
import {
  handleErrorAndNotify,
  handleSuccessAndNotify
} from "../../utils/apiUtils"
import { gameApi } from "../game/gameApi"
import { initializeModal } from "../modals/handleModalsSlice"

// ! NOTE: Manually triggered queries must be of type "lazy" while manually triggered mutations do not

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5001/api/auth/",
    credentials: "include"
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // first is response, second is req obj you're sending
    // FIXME: Refactor modal logic to one function call, "handleModalCascade()"
    signup: builder.mutation<CreatedUser, SignUpFormData>({
      query: (body) => ({ url: "signup", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(showLoadingModal("Signing you up..."))
        dispatch(initializeModal("signup"))
        try {
          const res = await queryFulfilled
          handleSuccessAndNotify(dispatch, "signup", {
            ...res.data,
            isNewUser: true
          })
        } catch (err) {
          if (isCustomApiResponse(err)) {
            // The error message here comes from server (see authController)
            handleErrorAndNotify(dispatch, err.error.data.message)
          } else {
            handleErrorAndNotify(dispatch, "Something went wrong.")
          }
        }
      }
    }),
    signin: builder.mutation<CreatedUser, SignInFormData>({
      query: (body) => ({ url: "signin", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(showLoadingModal("Signing you in..."))
        dispatch(initializeModal("signin"))
        try {
          const res = await queryFulfilled
          handleSuccessAndNotify(dispatch, "signin", {
            ...res.data,
            isNewUser: false
          })
        } catch (err) {
          dispatch(hideLoadingModal())
          if (isCustomApiResponse(err)) {
            // The error message here comes from server (see authController)
            handleErrorAndNotify(dispatch, err.error.data.message)
          } else {
            handleErrorAndNotify(dispatch, "Something went wrong.")
          }
        }
      }
    }),
    signout: builder.mutation<{}, void>({
      query: () => ({ url: "signout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(showLoadingModal("Signing out..."))
        dispatch(initializeModal("signout"))
        try {
          await queryFulfilled
          // WARNING: You need to have only ONE api. Should not be calling two methods to clear the cache
          // HACK: Temporary work-around
          dispatch(authApi.util.resetApiState())
          dispatch(gameApi.util.resetApiState())
          handleSuccessAndNotify(dispatch, "signout", {
            _id: "",
            email: "",
            displayName: "",
            activeGameId: "",
            isNewUser: false
          })
        } catch (err) {
          if (isCustomApiResponse(err)) {
            // The error message here comes from server (see authController)
            handleErrorAndNotify(dispatch, err.error.data.message)
          } else {
            handleErrorAndNotify(dispatch, "Something went wrong.")
          }
        }
      }
    })
  })
})

export const { useSignupMutation, useSigninMutation, useSignoutMutation } =
  authApi
export { authApi }
