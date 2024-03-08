import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConfirmModalState {
  details: string;
  message: string;
  showConfirmModal: boolean;
}

const initialState: ConfirmModalState = {
  details: "",
  message: "",
  showConfirmModal: false,
};

const confirmModalSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    showConfirmModal: (
      state,
      action: PayloadAction<{ details: string; message: string }>,
    ) => {
      state.showConfirmModal = true;
      state.details = action.payload.details;
      state.message = action.payload.message;
    },
    hideConfirmModal: (state) => {
      state.showConfirmModal = false;
    },
  },
});

export const { showConfirmModal, hideConfirmModal } = confirmModalSlice.actions;
export default confirmModalSlice.reducer;
