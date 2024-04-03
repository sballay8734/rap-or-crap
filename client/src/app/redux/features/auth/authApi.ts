import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  SignInFormData,
  SignUpFormData
} from "../../../../types/ClientAuthTypes"
import { CreatedUser } from "../../../../types/responsesFromServer"
import { setResponseMessage } from "../serverResponse/serverResponseSlice"
import { isCustomApiResponse } from "../../../helpers/errorReform"
import { setUser, clearUser } from "../user/userSlice"
import { hideLoadingModal, showLoadingModal } from "../modals/loadingModalSlice"

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
    signup: builder.mutation<CreatedUser, SignUpFormData>({
      query: (body) => ({ url: "signup", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled
          dispatch(setUser(res.data))
          dispatch(
            setResponseMessage({
              successResult: true,
              message: "Account creation successful!"
            })
          )
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
                message: "Something went wrong with the sign up procedure."
              })
            )
          }
        }
      }
    }),
    signin: builder.mutation<CreatedUser, SignInFormData>({
      query: (body) => ({ url: "signin", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // TODO: Extract showing/hiding modal states. There's really only four response types. Extract 1 & 3. Extract 2 & 4.
        // 1. Errors. // handleResult
        // 2. Errors you want to show the user. // handleAndShowResult
        // 3. Success. // handleResult
        // 4. Success you want to show the user. // handleAndShowResult

        dispatch(showLoadingModal())
        try {
          const res = await queryFulfilled
          dispatch(setUser(res.data))
          dispatch(hideLoadingModal())
          dispatch(
            setResponseMessage({
              successResult: true,
              message: "You are signed in!"
            })
          )
        } catch (err) {
          dispatch(hideLoadingModal())
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
                message: "Something went wrong with the sign in procedure."
              })
            )
          }
        }
      }
    }),
    signout: builder.mutation<{}, void>({
      query: () => ({ url: "signout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(clearUser())
          dispatch(
            setResponseMessage({
              successResult: true,
              message: "You have been signed out!"
            })
          )
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
                message: "Something went wrong with the sign out procedure."
              })
            )
          }
        }
      }
    })
  })
})

export const { useSignupMutation, useSigninMutation, useSignoutMutation } =
  authApi
export { authApi }

/* 
  
*/
