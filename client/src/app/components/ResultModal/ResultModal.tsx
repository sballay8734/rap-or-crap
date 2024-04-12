import { createPortal } from "react-dom"
import { useDispatch, useSelector } from "react-redux"

import { RootState } from "../../redux/store"
import { errorClient } from "../../helpers/logFormatter"
import { hideResultModal } from "../../redux/features/modals/resultModalSlice"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import {
  useFetchActiveGameQuery,
  useUpdateWithNewPromptMutation
} from "../../redux/features/game/gameApi"
import { useNavigate } from "react-router-dom"

export default function ResultModal() {
  const navigate = useNavigate()

  const { gameId } = useFetchActiveGameQuery("skip", {
    selectFromResult: ({ data }) => ({
      gameId: data?._id
    })
  })
  const dispatch = useDispatch()
  const [getNewPrompt] = useUpdateWithNewPromptMutation()
  const { isVisible, data } = useSelector(
    (state: RootState) => state.resultModal
  )

  async function handleBackToMainMenu() {
    if (gameId) {
      await getNewPrompt(gameId)
    } else {
      errorClient("gameId is undefined. Cannot fetch new prompt.")
    }

    dispatch(hideResultModal())
    navigate("/home")
  }

  async function handleContinueGame() {
    if (gameId) {
      await getNewPrompt(gameId)
    } else {
      errorClient("gameId is undefined. Cannot fetch new prompt.")
    }
    dispatch(hideResultModal())
  }

  // Modal to render
  const children = (
    <div
      className={`result-modal-container fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 px-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-w-full flex-col overflow-hidden rounded-3xl bg-white"
      >
        {/* HEADER */}
        <h2 className="modal-header relative w-full min-h-20 bg-surfaceLighter text-4xl flex items-center justify-center">
          RESULTS
        </h2>
        {/* BODY */}
        <div className="flex flex-col items-center justify-between">
          <div className="correct bg-surface w-full flex flex-col items-center py-2 text-white">
            <h2 className="text-2xl font-bold text-green-500">SAFE</h2>
            {data.correctPlayers.map((player) => {
              const playerName = Object.keys(player)[0]
              return (
                // TODO: Separate component
                <div
                  key={playerName}
                  className="player-result-card flex items-center justify-center gap-2"
                >
                  <h3>{formatNameFirstLastName(playerName)}</h3>
                  <p className="text-green-500">
                    {player[playerName].cCorrectStreak}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="wrong bg-surface w-full flex flex-col items-center py-2 text-white">
            <h2 className="text-2xl font-bold text-red-500">DRINK UP</h2>
            {data.wrongPlayers.map((player) => {
              const playerName = Object.keys(player)[0]
              return (
                // TODO: Separate component
                <div
                  key={playerName}
                  className="player-result-card flex items-center justify-center gap-2"
                >
                  <h3>{formatNameFirstLastName(playerName)}</h3>
                  <p className="text-red-500">
                    {player[playerName].cWrongStreak}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
        {/* BUTTONS */}
        <div className="flex w-full items-center justify-center">
          <button
            onClick={handleBackToMainMenu}
            className="bg-primaryVariant px-4 py-4 w-full text-white"
          >
            Main Menu
          </button>
          <button
            onClick={handleContinueGame}
            className="bg-green-300 px-4 py-4 w-full"
          >
            Next Lyric {">"}
          </button>
        </div>
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  return createPortal(children, modalContainer)
}
