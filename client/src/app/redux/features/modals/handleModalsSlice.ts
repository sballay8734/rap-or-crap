// TODO: Modals need to be managed here and rendered as a list
// Instead of rendering a specific modal, you will push the modals to this list and render the entire list
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearUser } from "../user/userSlice"

export interface NotifyModal {
  isVisible: boolean
  isSuccess: boolean | null
  message: string | null
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

      state.modalsToRender[modalId] = {
        isVisible: false,
        isSuccess: null,
        message: null
      }
    },
    addModal: (
      state,
      action: PayloadAction<{ modalId: string; data: NotifyModal }>
    ) => {
      const { modalId, data } = action.payload

      state.modalsToRender[modalId] = {
        isVisible: data.isVisible,
        isSuccess: data.isSuccess,
        message: data.message
      }
    },
    hideModal: (state, action: PayloadAction<string>) => {
      const modalId = action.payload

      state.modalsToRender[modalId].isVisible = false
      state.modalsToRender[modalId].isSuccess = null
    },
    removeModal: (state, action: PayloadAction<string>) => {
      const modalId = action.payload

      delete state.modalsToRender[modalId]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clearUser, (state, action) => {
      state = initialState
    })
  }
})

export const { addModal, hideModal, removeModal, initializeModal } =
  notifyModalsSlice.actions
export default notifyModalsSlice.reducer
