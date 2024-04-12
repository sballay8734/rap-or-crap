import { Dispatch } from "@reduxjs/toolkit"

import {
  hideLoadingModal,
  showLoadingModal
} from "../features/modals/loadingModalSlice"
import {
  addModal,
  initializeModal,
  removeModal
} from "../features/modals/handleModalsSlice"

const modalActionMap: { [action: string]: string } = {
  signup: "signup",
  signin: "signin",
  signout: "signout",
  fetchActiveGame: "fetchActiveGame"
}

const successMsgMap: { [action: string]: string } = {
  signup: "Account creation successful!",
  signin: "You are signed in!",
  signout: "You have been logged out.",
  fetchActiveGame: "Existing game found!",
  deleteGame: "Game deleted!",
  initializeGame: "Game initialized!",
  createGame: "New game initialized!",
  updateGame: "Game updated!"
}

// export function handleErrorSilently() {}
export function handleSuccessSilently(dispatch: Dispatch) {
  dispatch(hideLoadingModal())
}

export function handleErrorAndNotify(dispatch: Dispatch, message: string) {
  dispatch(hideLoadingModal())
  dispatch(
    addModal({
      modalId: "signin",
      data: { isSuccess: false, message }
    })
  )
}

export function handleSuccessAndNotify(dispatch: Dispatch, action: string) {
  dispatch(hideLoadingModal())
  dispatch(
    addModal({
      modalId: modalActionMap[action],
      data: { isSuccess: true, message: successMsgMap[action] }
    })
  )
}

interface ModalCascadeProps {
  start: (
    dispatch: Dispatch,
    shouldShowLoadingModal: boolean,
    modalKey: string
  ) => void
  endWithSuccess: (
    dispatch: Dispatch,
    notifyUser: boolean,
    modalId: string
  ) => void
  endWithError: (
    dispatch: Dispatch,
    notifyUser: boolean,
    modalId: string,
    msg?: string
  ) => void
}

const startMsgMap: { [key: string]: string } = {
  fetchActiveGame: "Checking for existing game..."
}

const sucMsgMap: { [key: string]: string } = {
  fetchActiveGame: "Existing game found!"
}

const failMsgMap: { [key: string]: string } = {
  fetchActiveGame: ""
}

const defaultErr = "Something went wrong."

export function modalCascade(): ModalCascadeProps {
  return {
    start: (dispatch, shouldShowLoadingModal, modalKey) => {
      const msg = startMsgMap[modalKey] || "Loading..."

      shouldShowLoadingModal && dispatch(showLoadingModal(msg))
      dispatch(initializeModal(modalKey))
    },

    endWithSuccess: (dispatch, notifyUser, modalId) => {
      const data = { isSuccess: true, message: sucMsgMap[modalId] }

      dispatch(hideLoadingModal())
      notifyUser && dispatch(addModal({ modalId, data }))
      // dispatch(removeModal(modalId)) // WARNING: Not sure if needed
    },

    endWithError: (dispatch, notifyUser, modalId, msg = defaultErr) => {
      const data = { isSuccess: false, message: msg }

      dispatch(hideLoadingModal())
      notifyUser && dispatch(addModal({ modalId, data }))
      // dispatch(removeModal(modalId)) // WARNING: Not sure if needed
    }
  }
}
