// !TODO: According to redux documentation, you should only have ONE createApi call per application. You need to refactor your store config

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  SignInFormData,
  SignUpFormData
} from "../../../../types/ClientAuthTypes"
import { CreatedUser } from "../../../../types/responsesFromServer"
import { isCustomApiResponse } from "../../../helpers/errorReform"
import { gameApi } from "../game/gameApi"
import { clearUser, setUser } from "../user/userSlice"
import { modalCascade } from "../../utils/apiUtils"

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_URL}/api/auth/`,
    credentials: "include"
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // first is response, second is req obj you're sending
    signup: builder.mutation<CreatedUser, SignUpFormData>({
      query: (body) => ({ url: "signup", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const modalId = "signup"

        modalCascade().start(dispatch, true, modalId)

        try {
          const res = await queryFulfilled
          const data = { ...res.data, isNewUser: false }

          dispatch(setUser(data))

          modalCascade().endWithSuccess(dispatch, true, modalId)
        } catch (err) {
          if (isCustomApiResponse(err)) {
            const errorMsg = err.error.data.message
            modalCascade().endWithError(dispatch, true, modalId, errorMsg)
          } else {
            modalCascade().endWithError(dispatch, true, modalId)
          }
        }
      }
    }),
    signin: builder.mutation<CreatedUser, SignInFormData>({
      query: (body) => ({ url: "signin", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const modalId = "signin"

        modalCascade().start(dispatch, true, modalId)

        try {
          const res = await queryFulfilled
          const data = { ...res.data, isNewUser: false }

          dispatch(setUser(data))

          modalCascade().endWithSuccess(dispatch, true, modalId)
        } catch (err) {
          if (isCustomApiResponse(err)) {
            const errorMsg = err.error.data.message
            modalCascade().endWithError(dispatch, true, modalId, errorMsg)
          } else {
            modalCascade().endWithError(dispatch, true, modalId)
          }
        }
      }
    }),
    signout: builder.mutation<{}, void>({
      query: () => ({ url: "signout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const modalId = "signout"

        modalCascade().start(dispatch, true, modalId)

        try {
          await queryFulfilled
          // WARNING: You need to have only ONE api. Should not be calling two methods to clear the cache
          // HACK: Temporary work-around
          dispatch(authApi.util.resetApiState())
          dispatch(gameApi.util.resetApiState())
          dispatch(clearUser())

          modalCascade().endWithSuccess(dispatch, true, modalId)
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

export const { useSignupMutation, useSigninMutation, useSignoutMutation } =
  authApi
export { authApi }
