// AuthenticatedView.tsx
import { Outlet } from "react-router-dom"

import ConfirmModal from "../components/ConfirmModal/ConfirmModal"
import ResultModal from "../components/ResultModal/ResultModal"
import IsLoadingModal from "../components/reusable/IsLoadingModal"
import { RenderModals } from "../components/RenderModals/RenderModals"
import ScoreboardModal from "../components/ScoreboardModal/ScoreBoardModal"

export default function AuthenticatedView() {
  return (
    <div className="container flex h-full w-full items-center justify-center relative z-1">
      <Outlet />
      <ConfirmModal />
      <ResultModal />
      <IsLoadingModal />
      <RenderModals />
      <ScoreboardModal />
    </div>
  )
}
