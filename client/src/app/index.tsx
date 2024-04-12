import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

import { RootState } from "./redux/store"
import ConfirmModal from "./components/ConfirmModal/ConfirmModal"
import ResultModal from "./components/ResultModal/ResultModal"
import IsLoadingModal from "./components/reusable/IsLoadingModal"
import { RenderModals } from "./components/RenderModals/RenderModals"
import ScoreboardModal from "./components/ScoreboardModal/ScoreBoardModal"

function App(): JSX.Element {
  const user = useSelector((state: RootState) => state.user.user)

  const isUserLoggedIn = user !== null

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

      <IsLoadingModal />
      <RenderModals />

      {isUserLoggedIn ? (
        <>
          <ResultModal />
          <ConfirmModal />
          <ScoreboardModal />
        </>
      ) : null}
    </div>
  )
}

export default App
