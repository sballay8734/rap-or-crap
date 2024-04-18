import { createSlice } from "@reduxjs/toolkit"

export interface ScoreboardModalState {
  isVisible: boolean
}

const initialState: ScoreboardModalState = {
  isVisible: false
}

const scoreboardModalSlice = createSlice({
  name: "scoreboardModalSlice",
  initialState,
  reducers: {
    showScoreboard: (state) => {
      state.isVisible = true
    },
    hideScoreboard: (state) => {
      state.isVisible = false
    }
  }
})

export const { hideScoreboard, showScoreboard } = scoreboardModalSlice.actions
export default scoreboardModalSlice.reducer
