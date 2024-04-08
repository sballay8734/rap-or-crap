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
    hideLoadingModal: () => {
      return initialState
    }
  }
})

export const { hideLoadingModal, showLoadingModal } = loadingModalSlice.actions
export default loadingModalSlice.reducer

// "I'm Sure" triggers "Checking for existing game"
// "Start" triggers "Checking for existing game"
// "Something is wrong" also gets displayed
