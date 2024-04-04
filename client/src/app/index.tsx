import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import { RootState } from "./redux/store"
import ConfirmModal from "./components/confirmModal"
import ResultModal from "./components/resultModal"
import IsLoadingModal from "./components/reusable/IsLoadingModal"
import { RenderModals } from "./components/renderModals"

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
      <RenderModals />
    </div>
  )
}

export default App
