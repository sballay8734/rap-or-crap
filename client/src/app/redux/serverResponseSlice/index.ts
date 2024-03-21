import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ServerResponseState {
  successResult: true | false | null;
  responseMessage: string | null;
}

const initialState: ServerResponseState = {
  successResult: null,
  responseMessage: null,
};

const serverResponseSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setResponseMessage: (
      state,
      action: PayloadAction<{ successResult: boolean; message: string }>,
    ) => {
      const { successResult, message } = action.payload;

      if (message.length > 50) console.error(`MSG IS TOO LONG! - ${message}`);

      state.successResult = successResult;
      state.responseMessage = message;
    },
    clearResponseMessage: (state) => {
      state.successResult = null;
      state.responseMessage = null;
    },
  },
});

export const { setResponseMessage, clearResponseMessage } =
  serverResponseSlice.actions;
export default serverResponseSlice.reducer;
