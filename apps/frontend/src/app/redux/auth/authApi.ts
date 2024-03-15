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
      // ! FIXME: This code is working and it's just TS that's complaining. Not sure why though.
      transformResponse: (response: {
        success: boolean;
        message: string;
        payload?: CreatedUser;
      }) => {
        if (response.success) {
          return {
            success: true,
            message: response.message,
            payload: response.payload || null,
          };
        } else {
          return {
            success: false,
            message: response.message,
          };
        }
      },
    }),
  }),
});

// ! FIXME: Ideally this should not be "any" but as of now it prevents TS error
export const { useLazySignupMutation } = authApi as any;
export { authApi };

/* 
  
*/
