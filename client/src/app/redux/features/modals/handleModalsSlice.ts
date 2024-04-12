// TODO: Modals need to be managed here and rendered as a list
// Instead of rendering a specific modal, you will push the modals to this list and render the entire list
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearUser } from "../user/userSlice"

export interface NotifyModal {
  isVisible: boolean
  isSuccess: boolean | null
  message: string | null
  index: number
}

interface ModalsObject {
  [modalId: string]: NotifyModal
}

export interface NotifyModalsState {
  modalsToRender: ModalsObject
}

const initialState: NotifyModalsState = {
  modalsToRender: {}
}

const notifyModalsSlice = createSlice({
  name: "notifyModalsSlice",
  initialState,
  reducers: {
    initializeModal: (state, action: PayloadAction<string>) => {
      const modalId = action.payload
      const currentModalIds = Object.keys(state.modalsToRender)
      const index = currentModalIds.length > 0 ? currentModalIds.length : 0

      state.modalsToRender[modalId] = {
        isVisible: false,
        isSuccess: null,
        message: null,
        index
      }
    },
    // addModal: (
    //   state,
    //   action: PayloadAction<{
    //     modalId: string
    //     data: Omit<NotifyModal, "index">
    //   }>
    // ) => {
    //   const { modalId, data } = action.payload
    //   const currentModalIds = Object.keys(state.modalsToRender)
    //   const index = currentModalIds.indexOf(modalId)

    //   if (index === -1) {
    //     // If the modal hasn't been added yet, set the index to the end of the array
    //     state.modalsToRender[modalId] = {
    //       ...data,
    //       index: currentModalIds.length
    //     }
    //   } else {
    //     // If the modal has already been added, update the index
    //     state.modalsToRender[modalId] = {
    //       ...data,
    //       index
    //     }
    //   }
    // },
    addModal: (
      state,
      action: PayloadAction<{
        modalId: string
        data: Omit<NotifyModal, "index" | "isVisible">
      }>
    ) => {
      const { modalId, data } = action.payload
      const currentModalIds = Object.keys(state.modalsToRender)
      const index = currentModalIds.indexOf(modalId)

      if (index === -1) {
        // If the modal hasn't been added yet, set the index to the end of the array
        state.modalsToRender[modalId] = {
          isVisible: true,
          ...data,
          index: currentModalIds.length
        }
      } else {
        // If the modal has already been added, update the index
        state.modalsToRender[modalId] = {
          isVisible: true,
          ...data,
          index
        }
      }
    },
    hideModal: (state, action: PayloadAction<string>) => {
      const modalId = action.payload

      state.modalsToRender[modalId].isVisible = false
      // state.modalsToRender[modalId].isSuccess = null
    },
    removeModal: (state, action: PayloadAction<string>) => {
      const modalId = action.payload

      delete state.modalsToRender[modalId]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clearUser, () => {
      return initialState
    })
  }
})

export const { addModal, hideModal, removeModal, initializeModal } =
  notifyModalsSlice.actions
export default notifyModalsSlice.reducer
