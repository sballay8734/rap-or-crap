import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface FetchingModalSlice {
  isVisible: boolean
  isSuccess: boolean | null
  message: string | null
}

const initialState: FetchingModalSlice = {
  isVisible: false,
  isSuccess: null,
  message: null
}

const fetchingModalSlice = createSlice({
  name: "fetchingModalSlice",
  initialState,
  reducers: {
    showFetchingModal: (
      state,
      action: PayloadAction<{ message: string; isSuccess: boolean | null }>
    ) => {
      state.isVisible = true
      state.message = action.payload.message
      state.isSuccess = action.payload.isSuccess
    },
    hideFetchingModal: (state) => {
      state.isVisible = false
      state.isSuccess = null
    }
  }
})

export const { hideFetchingModal, showFetchingModal } =
  fetchingModalSlice.actions
export default fetchingModalSlice.reducer
