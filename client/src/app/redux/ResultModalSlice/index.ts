import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  InitializedGameInstance,
  PlayersObject
} from "../GameHandling/gameHandlingApi"

// * This data is ONLY used to display the modal. It is transformed inside of handleShowModal and is NOT used anywhere else or for any other reason than displaying the information to the user.

interface DisplayData {
  correctPlayers: PlayersObject[]
  wrongPlayers: PlayersObject[]
  skipped: PlayersObject[]
}

export interface ResultModal {
  data: DisplayData
  modalIsShown: boolean
}

const initialState: ResultModal = {
  data: {
    correctPlayers: [],
    wrongPlayers: [],
    skipped: []
  },
  modalIsShown: false
}

// TODO:
// ! Make sure to use currentLyric and YT link in modal as well
const resultModalSlice = createSlice({
  name: "resultModalSlice",
  initialState,
  reducers: {
    handleShowModal: (
      state,
      action: PayloadAction<InitializedGameInstance>
    ) => {
      const { playersObject, currentLyric } = action.payload
      // clear existing information first (propbably unecessary)
      state.data = { correctPlayers: [], wrongPlayers: [], skipped: [] }
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
      state.modalIsShown = true
    },
    hideResultModal: (state) => {
      state.modalIsShown = false
    }
  }
})

export const { hideResultModal, handleShowModal } = resultModalSlice.actions
export default resultModalSlice.reducer
