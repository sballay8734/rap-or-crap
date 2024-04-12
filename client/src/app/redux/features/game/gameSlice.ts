import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearUser } from "../user/userSlice"

type Answer = "crap" | "skip" | "rap" | null

export interface SelectionsState {
  [playerName: string]: Answer
}

interface FullSelectionsState {
  playerList: string[]
  playerAnswers: SelectionsState
}

// INITIAL STATE
const initialState: FullSelectionsState = {
  playerList: [],
  playerAnswers: {}
}

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    initializePlayers: (state, action: PayloadAction<SelectionsState>) => {
      state.playerAnswers = action.payload
    },
    addPlayer: (state, action: PayloadAction<string>) => {
      const newPlayer = action.payload

      state.playerList = [...state.playerList, newPlayer]
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      const playerToRemove = action.payload

      state.playerList = state.playerList.filter((p) => {
        return p !== playerToRemove
      })
    },
    setPlayerAnswer: (
      state,
      action: PayloadAction<{ playerName: string; answer: Answer }>
    ) => {
      const { playerName, answer } = action.payload

      state.playerAnswers[playerName] = answer
    },
    clearPlayers: () => {
      return initialState
    },
    clearPlayerAnswers: (state) => {
      for (const player of Object.keys(state.playerAnswers)) {
        state.playerAnswers[player] = null
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clearUser, () => {
      return initialState
    })
  }
})

export const {
  initializePlayers,
  setPlayerAnswer,
  clearPlayerAnswers,
  clearPlayers,
  addPlayer,
  removePlayer
} = gameSlice.actions
export default gameSlice.reducer
