import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const defaultHeader = "Hang On a Sec!";
const defaultFooter = "Are you sure you want to do this?";

export interface ConfirmModalState {
  message: string;
  showModal: boolean;
}

const initialState: ConfirmModalState = {
  message: "",
  showModal: false,
};

const confirmModalSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<string>) => {
      console.log("From Slice: SHOWN");
      state.showModal = true;
      state.message = action.payload;
    },
    hideModal: (state) => {
      console.log("From Slice: HIDDEN");
      state.showModal = false;
    },
  },
});

export const { showModal, hideModal } = confirmModalSlice.actions;
export default confirmModalSlice.reducer;
