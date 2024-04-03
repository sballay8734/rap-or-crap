import { Dispatch } from "@reduxjs/toolkit"

import { User, clearUser, setUser } from "../features/user/userSlice"
import { setResponseMessage } from "../features/serverResponse/serverResponseSlice"
import { hideLoadingModal } from "../features/modals/loadingModalSlice"

type DataType = User | null

interface IArgMap {
  [action: string]: any
}

// Contains all actions you'd like to dispatch (noAction is for clarity)
const ArgMap: IArgMap = {
  setUser: (data: User) => setUser(data),
  clearUser: () => clearUser(),
  //
  noAction: () => console.log("No action")
}

export function handleErrorSilently() {}

export function handleErrorAndNotify(dispatch: Dispatch, message: string) {
  dispatch(hideLoadingModal())
  dispatch(setResponseMessage({ successResult: false, message }))
}

export function handleSuccessSilently() {}

export function handleSuccessAndNotify(
  dispatch: Dispatch,
  action: string,
  data: DataType,
  message: string
) {
  dispatch(ArgMap[action](data))
  dispatch(hideLoadingModal())
  dispatch(setResponseMessage({ successResult: true, message }))
}
