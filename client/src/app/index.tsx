import { useSelector } from "react-redux"
import { useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import { RootState } from "./redux/store"
import ConfirmModal from "./components/confirmModal"
import ResultModal from "./components/resultModal"
import NotificationModal from "./components/reusable/NotificationModal"
import IsLoadingModal from "./components/reusable/IsLoadingModal"

function App(): JSX.Element {
  const user = useSelector((state: RootState) => state.user.user)

  const isUserLoggedIn = user !== null

  // Are you sure? Modal
  const confirmModalIsShown = useSelector(
    (state: RootState) => state.confirmModal.isVisible
  )
  // Answer results
  const resultModalIsShown = useSelector(
    (state: RootState) => state.resultModal.isVisible
  )
  // All notification modals
  const notifyModals = useSelector(
    (state: RootState) => state.notifyModals.modalsToRender
  )
  // Transform notifyModals to an array
  const modalsToRender = Object.entries(notifyModals).map(
    ([modalId, data]) => ({
      modalId,
      ...data
    })
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
      {/* TODO: Don't use conditionals. Use opacity and pointer-events-none */}
      {confirmModalIsShown && <ConfirmModal />}
      {resultModalIsShown && <ResultModal />}
      <IsLoadingModal />
      {modalsToRender.map((notification, index) => {
        return <NotificationModal key={index} notification={notification} />
      })}
      {/* <ResponseModal />
      <IsFetchingModal /> */}
    </div>
  )
}

export default App
