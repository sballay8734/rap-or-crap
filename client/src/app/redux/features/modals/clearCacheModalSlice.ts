import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ClearCacheModalState {
  message: string
  isVisible: boolean
}

const initialState: ClearCacheModalState = {
  message: "",
  isVisible: false
}

const clearCacheModalSlice = createSlice({
  name: "confirmSlice",
  initialState,
  reducers: {
    showCacheModal: (state, action: PayloadAction<string>) => {
      state.isVisible = true
      state.message = action.payload
    },
    hideCacheModal: (state) => {
      state.isVisible = false
    }
  }
})

export const { showCacheModal, hideCacheModal } = clearCacheModalSlice.actions
export default clearCacheModalSlice.reducer
