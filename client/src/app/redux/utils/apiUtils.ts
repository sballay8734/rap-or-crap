import { Dispatch } from "@reduxjs/toolkit"

import { NotifyModal } from "../features/modals/handleModalsSlice"
import { User } from "../features/user/userSlice"
import { setResponseMessage } from "../features/modals/responseModalSlice"
import { hideLoadingModal } from "../features/modals/loadingModalSlice"
import { addModal } from "../features/modals/handleModalsSlice"
import { InitializedGameInstance } from "../features/game/gameApi"

type DataType = User | NotifyModal | InitializedGameInstance

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
  createGame: "New game initialized!"
}

// export function handleErrorSilently() {}
export function handleSuccessSilently(dispatch: Dispatch) {
  dispatch(hideLoadingModal())
}

export function handleErrorAndNotify(dispatch: Dispatch, message: string) {
  dispatch(hideLoadingModal())
  dispatch(setResponseMessage({ successResult: false, message }))
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
