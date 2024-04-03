import { createSlice } from "@reduxjs/toolkit"

interface LoadingModalState {
  isVisible: boolean
}

const initialState: LoadingModalState = {
  isVisible: false
}

const loadingModalSlice = createSlice({
  name: "loadingModalSlice",
  initialState,
  reducers: {
    showLoadingModal: (state) => {
      state.isVisible = true
    },
    hideLoadingModal: (state) => {
      state.isVisible = false
    }
  }
})

export const { hideLoadingModal, showLoadingModal } = loadingModalSlice.actions
export default loadingModalSlice.reducer
