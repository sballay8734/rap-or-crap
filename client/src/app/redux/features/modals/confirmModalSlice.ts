import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ConfirmModalState {
  details: string
  message: string
  isVisible: boolean
}

const initialState: ConfirmModalState = {
  details: "",
  message: "",
  isVisible: false
}

const confirmModalSlice = createSlice({
  name: "confirmSlice",
  initialState,
  reducers: {
    showConfirmModal: (
      state,
      action: PayloadAction<{ details: string; message: string }>
    ) => {
      state.isVisible = true
      state.details = action.payload.details
      state.message = action.payload.message
    },
    hideConfirmModal: (state) => {
      state.isVisible = false
    }
  }
})

export const { showConfirmModal, hideConfirmModal } = confirmModalSlice.actions
export default confirmModalSlice.reducer
