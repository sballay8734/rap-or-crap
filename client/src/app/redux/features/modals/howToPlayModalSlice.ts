import { createSlice } from "@reduxjs/toolkit"

export interface HowToPlayModalSlice {
  isVisible: boolean
}

const initialState: HowToPlayModalSlice = {
  isVisible: false
}

const howToPlayModalSlice = createSlice({
  name: "howToPlayModalSlice",
  initialState,
  reducers: {
    showRules: (state) => {
      state.isVisible = true
    },
    hideRules: (state) => {
      state.isVisible = false
    }
  }
})

export const { hideRules, showRules } = howToPlayModalSlice.actions
export default howToPlayModalSlice.reducer
