import { Dispatch } from "@reduxjs/toolkit"

import { NotifyModal } from "../features/modals/handleModalsSlice"
import { User, clearUser, setUser } from "../features/user/userSlice"
import { setResponseMessage } from "../features/modals/responseModalSlice"
import { hideLoadingModal } from "../features/modals/loadingModalSlice"
import { addModal } from "../features/modals/handleModalsSlice"

type DataType = User | NotifyModal

interface IArgMap {
  [action: string]: any
}

// Contains all actions you'd like to dispatch (noAction is for clarity)
const ArgMap: IArgMap = {
  signup: (data: User) => setUser(data),
  signin: (data: User) => setUser(data),
  signout: () => clearUser(),
  //
  noAction: () => console.log("No action")
}

const modalActionMap: { [action: string]: string } = {
  signup: "signup",
  signin: "signin",
  signout: "signout"
}

const successMsgMap: { [action: string]: string } = {
  signup: "Account creation successful!",
  signin: "You are signed in!",
  signout: "You have been logged out."
}

export function handleErrorAndNotify(dispatch: Dispatch, message: string) {
  dispatch(hideLoadingModal())
  dispatch(setResponseMessage({ successResult: false, message }))
}

export function handleSuccessAndNotify(
  dispatch: Dispatch,
  action: string,
  data: DataType
) {
  dispatch(ArgMap[action](data))
  dispatch(hideLoadingModal())
  dispatch(
    addModal({
      modalId: modalActionMap[action],
      data: { isVisible: true, isSuccess: true, message: successMsgMap[action] }
    })
  )
}

export function handleSuccessSilently() {}
export function handleErrorSilently() {}
