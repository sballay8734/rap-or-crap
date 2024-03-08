import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ErrorModalState {
  message: string | null;
}

const initialState: ErrorModalState = {
  message: null,
};

const errorModalSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearError: (state) => {
      state.message = null;
    },
  },
});

export const { setError, clearError } = errorModalSlice.actions;

export default errorModalSlice.reducer;
