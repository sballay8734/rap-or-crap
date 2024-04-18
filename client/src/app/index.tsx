import { useSelector } from "react-redux"

import { RootState } from "./redux/store"
import { Navigate, Outlet } from "react-router-dom"
// CANT FIND ISLOADINGMODAL
import { RenderModals } from "./components/RenderModals/RenderModals"
import ResultModal from "./components/ResultModal/ResultModal"
import ConfirmModal from "./components/ConfirmModal/ConfirmModal"
import ScoreboardModal from "./components/ScoreboardModal/ScoreBoardModal"
import NoMoreLyricsModal from "./components/NoMoreLyricsModal/NoMoreLyrics"
import IsLoadingModal from "./components/Reusable/IsLoadingModal"

// TODO: This logic needs to be refactored <AuthView /> : <UnAuthView />

function App(): JSX.Element {
  const user = useSelector((state: RootState) => state.user.user)
  const isUserLoggedIn = user !== null

  return (
    <div className="flex h-full w-full items-center justify-center relative z-1">
      {isUserLoggedIn ? (
        <>
          <Navigate to="/home" replace />
          <Outlet />
        </>
      ) : (
        <>
          <Navigate to="/auth/signin" replace />
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
          <NoMoreLyricsModal />
        </>
      ) : null}
    </div>
  )
}

export default App
