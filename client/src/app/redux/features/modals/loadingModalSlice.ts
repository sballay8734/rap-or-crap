import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface LoadingModalState {
  isVisible: boolean
  message: string | null
}

const initialState: LoadingModalState = {
  isVisible: false,
  message: null
}

const loadingModalSlice = createSlice({
  name: "loadingModalSlice",
  initialState,
  reducers: {
    showLoadingModal: (state, action: PayloadAction<string>) => {
      state.isVisible = true
      state.message = action.payload
    },
    hideLoadingModal: (state) => {
      state.isVisible = false
    }
  }
})

export const { hideLoadingModal, showLoadingModal } = loadingModalSlice.actions
export default loadingModalSlice.reducer
