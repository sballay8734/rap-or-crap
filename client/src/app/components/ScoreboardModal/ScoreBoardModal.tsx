// mTODO: Handle players having the same score (maybe go by best streak?)

import { createPortal } from "react-dom"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"

import { hideScoreboard } from "../../redux/features/modals/scoreboardModalSlice"
import { RootState } from "../../redux/store"
import { useFetchActiveGameQuery } from "../../redux/features/game/gameApi"
import ScoreboardCard from "../ScoreboardCard/ScoreboardCard"
import { RxAvatar } from "react-icons/rx"

export default function ScoreboardModal() {
  const dispatch = useDispatch()
  const scoreboardIsShown = useSelector(
    (state: RootState) => state.scoreboard.isVisible
  )

  const user = useSelector((state: RootState) => state.user.user)

  const { players } = useFetchActiveGameQuery("skip", {
    selectFromResult: ({ data }) => ({
      players: data?.playersObject
    })
  })

  function sortPlayers() {
    if (!players) return []

    const playersArray = Object.keys(players)

    return playersArray.sort((a, b) => {
      const aTotalAnswers = players[a].cCorrect + players[a].cWrong
      const aPctCorrect =
        aTotalAnswers > 0 ? (players[a].cCorrect / aTotalAnswers) * 100 : 0

      const bTotalAnswers = players[b].cCorrect + players[b].cWrong
      const bPctCorrect =
        bTotalAnswers > 0 ? (players[b].cCorrect / bTotalAnswers) * 100 : 0

      return bPctCorrect - aPctCorrect
    })
  }

  // Modal to render
  const children = (
    <div
      onClick={() => dispatch(hideScoreboard())}
      className={`scoreboard-modal-container fixed inset-0 z-[1002] flex flex-col items-center justify-center bg-black/80 transition-all duration-300 ${
        scoreboardIsShown
          ? "opacity-100 translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-full"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal-content abosolute flex min-h-full min-w-full flex-col overflow-hidden bg-white`}
      >
        <div className="header flex flex-col items-center justify-center gap-2 h-1/5 bg-secondary">
          <h1 className="text-2xl">LEADERBOARD</h1>
          <div className="flex gap-2">
            <RxAvatar size={50} />
            <RxAvatar size={50} />
            <RxAvatar size={50} />
          </div>
        </div>
        <div className="players flex-grow bg-[#022424] flex flex-col py-1 overflow-auto px-1">
          {players &&
            sortPlayers().map((playerKey: string, index) => {
              const playerData = players[playerKey]
              return (
                <ScoreboardCard
                  key={playerKey}
                  playerName={playerKey}
                  playerData={playerData}
                  rank={index + 1}
                />
              )
            })}
        </div>
        <button
          className="bg-secondary min-h-20 text-black"
          onClick={() => dispatch(hideScoreboard())}
        >
          Close
        </button>
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  return createPortal(children, modalContainer)
}
