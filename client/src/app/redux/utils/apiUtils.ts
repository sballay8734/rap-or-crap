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
      data: { isVisible: true, isSuccess: false, message }
    })
  )
}

export function handleSuccessAndNotify(dispatch: Dispatch, action: string) {
  dispatch(hideLoadingModal())
  dispatch(
    addModal({
      modalId: modalActionMap[action],
      data: { isVisible: true, isSuccess: true, message: successMsgMap[action] }
    })
  )
}

interface ModalCascadeProps {
  start: (
    dispatch: Dispatch,
    shouldShowLoadingModal: boolean,
    modalKey: string,
    loadingModalMsg?: string
  ) => void
  end: (dispatch: Dispatch, modalId: string) => void
}

// ON START **************************************************
// dispatch
// showLoadingModal: boolean
// showLoadingModalMessage: string || null
// modalKey: string

// ON END ****************************************************
// modalId

export function modalCascade(): ModalCascadeProps {
  return {
    start: (
      dispatch,
      shouldShowLoadingModal,
      modalKey,
      loadingModalMsg = "Loading..."
    ) => {
      shouldShowLoadingModal && dispatch(showLoadingModal(loadingModalMsg))
      dispatch(initializeModal(modalKey))
    },
    end: (dispatch, modalId) => {
      dispatch(hideLoadingModal())
      dispatch(removeModal(modalId))
    }
  }
}
