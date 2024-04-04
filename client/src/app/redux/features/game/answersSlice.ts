import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Answer = "crap" | "skip" | "rap" | null

export interface SelectionsState {
  [playerName: string]: Answer
}

interface FullSelectionsState {
  playerAnswers: SelectionsState
}

// INITIAL STATE
const initialState: FullSelectionsState = {
  playerAnswers: {}
}

const answersSlice = createSlice({
  name: "answersSlice",
  initialState,
  reducers: {
    initializePlayers: (state, action: PayloadAction<SelectionsState>) => {
      state.playerAnswers = action.payload
    },
    setPlayerAnswer: (
      state,
      action: PayloadAction<{ playerName: string; answer: Answer }>
    ) => {
      const { playerName, answer } = action.payload

      state.playerAnswers[playerName] = answer
    },
    clearPlayerAnswers: (state) => {
      for (const player of Object.keys(state.playerAnswers)) {
        console.log(`Clearing ${player}`)
        state.playerAnswers[player] = null
      }
    }
  }
})

export const { initializePlayers, setPlayerAnswer, clearPlayerAnswers } =
  answersSlice.actions
export default answersSlice.reducer
