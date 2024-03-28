import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { InitializedGameInstance } from "../GameHandling/gameHandlingApi"

export interface ResultModal {
  correctPlayers: string[]
  wrongPlayers: string[]
  modalIsShown: boolean
}

const initialState: ResultModal = {
  correctPlayers: [],
  wrongPlayers: [],
  modalIsShown: false
}

const resultModalSlice = createSlice({
  name: "resultModalSlice",
  initialState,
  reducers: {
    handleShowModal: (
      state,
      action: PayloadAction<InitializedGameInstance>
    ) => {
      // update modal info before showing it

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
