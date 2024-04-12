import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// This interface is specifically for the apiUtil
// When dispatching to user, properties will NEVER be null
export interface ServerResponse {
  successResult: boolean
  responseMessage: string
}

// Here however, it is possible for the state to be null BUT,
// You are no longer rendering conditionally
export interface ServerResponseState {
  successResult: true | false | null
  responseMessage: string | null
}

const initialState: ServerResponseState = {
  successResult: null,
  responseMessage: null
}

const responseModalSlice = createSlice({
  name: "responseModalSlice",
  initialState,
  reducers: {
    setResponseMessage: (
      state,
      action: PayloadAction<{ successResult: boolean; message: string }>
    ) => {
      const { successResult, message } = action.payload

      if (message.length > 50) console.error(`MSG IS TOO LONG! - ${message}`)

      state.successResult = successResult
      state.responseMessage = message
      console.log("HIT SLICE")
    },
    clearResponseMessage: (state) => {
      state.successResult = null
      state.responseMessage = null
    }
  }
})

export const { setResponseMessage, clearResponseMessage } =
  responseModalSlice.actions
export default responseModalSlice.reducer
