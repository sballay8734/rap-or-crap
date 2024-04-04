import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type Answer = "crap" | "skip" | "rap" | null

export interface SelectionsState {
  [playerName: string]: Answer
}

interface FullSelectionsState {
  playerAnswers: SelectionsState
  localGameId: string | null
}

// INITIAL STATE
const initialState: FullSelectionsState = {
  playerAnswers: {},
  localGameId: null
}

const gameSlice = createSlice({
  name: "gameSlice",
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
        state.playerAnswers[player] = null
      }
    },

    // WARNING: The sole purpose of this reducer is to compare the fetched gameId with the current gameId and display the correct notification
    // HACK: This is temporary until you refactor and optimize queries
    setLocalGameId: (state, action: PayloadAction<string | null>) => {
      console.log("SETTING LOCAL:", action.payload)
      state.localGameId = action.payload
    }
  }
})

export const {
  initializePlayers,
  setPlayerAnswer,
  clearPlayerAnswers,
  setLocalGameId
} = gameSlice.actions
export default gameSlice.reducer
