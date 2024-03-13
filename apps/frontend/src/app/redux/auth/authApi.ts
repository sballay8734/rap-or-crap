import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SignUpFormData } from "../../../types/authTypes";
import { ApiResponse, CreatedUser } from "../../../types/responsesFromServer";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/api/auth/" }),
  endpoints: (builder) => ({
    // first is response, second is req obj you're sending
    lazySignup: builder.mutation<ApiResponse<CreatedUser>, SignUpFormData>({
      query: (body) => ({ url: "signup", method: "POST", body }),
      // ! NEED TO TRANSFORM RESPONSE HERE
    }),
  }),
});

// ! FIXME: Ideally this should not be "any" but as of now it prevents TS error
export const { useLazySignupMutation } = authApi as any;
export { authApi };
