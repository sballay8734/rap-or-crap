import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { PlayersObject, Results } from "../../../../types/ClientDataTypes"

// * This data is ONLY used to display the modal. It is transformed inside of handleShowModal and is NOT used anywhere else or for any other reason than displaying the information to the user.

interface IPrompt {
  artistName: string | null
  lyric: string
  youtubeUrl: string | null
  correctAnswer: "rap" | "crap"
}

interface DisplayData {
  correctPlayers: PlayersObject[]
  wrongPlayers: PlayersObject[]
  skipped: PlayersObject[]
  completedPrompt: IPrompt | null
}

export interface ResultModalState {
  data: DisplayData
  isVisible: boolean
}

const initialState: ResultModalState = {
  data: {
    correctPlayers: [],
    wrongPlayers: [],
    skipped: [],
    completedPrompt: null
  },
  isVisible: false
}

const resultModalSlice = createSlice({
  name: "resultModalSlice",
  initialState,
  reducers: {
    showResultModal: (state, action: PayloadAction<Results>) => {
      const {
        game: { playersObject },
        completedPrompt: { artistName, lyric, youtubeUrl, correctAnswer }
      } = action.payload
      // clear existing information first (propbably unecessary)
      state.data = {
        correctPlayers: [],
        wrongPlayers: [],
        skipped: [],
        completedPrompt: {
          artistName: artistName,
          lyric: lyric,
          youtubeUrl: youtubeUrl,
          correctAnswer: correctAnswer
        }
      }
      // update modal info before showing it
      for (const [playerName, playerData] of Object.entries(playersObject)) {
        // check for skipped first (intentional)
        if (playersObject[playerName].lastQSkipped === true) {
          state.data.skipped.push({ [playerName]: playerData })
        } else if (playersObject[playerName].lastQCorrect === true) {
          state.data.correctPlayers.push({ [playerName]: playerData })
        } else if (playersObject[playerName].lastQCorrect === false) {
          state.data.wrongPlayers.push({ [playerName]: playerData })
        }
      }

      // show modal
      state.isVisible = true
    },
    hideResultModal: (state) => {
      state.isVisible = false
    }
  }
})

export const { hideResultModal, showResultModal } = resultModalSlice.actions
export default resultModalSlice.reducer
