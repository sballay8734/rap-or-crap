import { useSelector } from "react-redux"
import { useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import { RootState } from "./redux/store"
import ConfirmModal from "./components/confirmModal"
import ResponseModal from "./components/responseModal"
import ResultModal from "./components/resultModal"
import IsLoadingModal from "./components/reusable/IsLoadingModal"
import IsFetchingModal from "./components/reusable/IsFetchingModal"

function App(): JSX.Element {
  const user = useSelector((state: RootState) => state.user.user)

  const isUserLoggedIn = user !== null

  const confirmModalIsShown = useSelector(
    (state: RootState) => state.confirmModal.isVisible
  )
  const resultModalIsShown = useSelector(
    (state: RootState) => state.resultModal.isVisible
  )

  return (
    <div className="container flex h-full w-full items-center justify-center">
      {isUserLoggedIn ? (
        <>
          <Navigate to="/home" replace />
          <Outlet />
        </>
      ) : (
        <>
          <Navigate to="/signin" replace />
          <Outlet />
        </>
      )}
      {confirmModalIsShown && <ConfirmModal />}
      {resultModalIsShown && <ResultModal />}
      <ResponseModal />
      <IsLoadingModal />
      <IsFetchingModal />
    </div>
  )
}

export default App
