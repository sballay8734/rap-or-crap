import { createPortal } from "react-dom"
import { useDispatch, useSelector } from "react-redux"

import { RootState } from "../../redux/store"
import { errorClient, logClient, warnClient } from "../../helpers/logFormatter"
import { hideResultModal } from "../../redux/features/modals/resultModalSlice"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import {
  useFetchActiveGameQuery,
  useUpdateWithNewPromptMutation
} from "../../redux/features/game/gameApi"
import { useNavigate } from "react-router-dom"

export default function ResultModal() {
  // HACK: localGameId is a temporary workaround for poor query structure
  const localGameId = useSelector((state: RootState) => state.game.localGameId)
  const navigate = useNavigate()

  const { gameId } = useFetchActiveGameQuery(localGameId, {
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
      className={`modal-background fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 px-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-w-full flex-col overflow-hidden rounded-3xl bg-white"
      >
        <h2 className="modal-header relative w-full min-h-20 bg-green-500 text-4xl flex items-center justify-center">
          RESULTS
        </h2>
        <div className="flex flex-col items-center justify-between px-4 py-4 gap-4">
          <div className="correct">
            <h2 className="text-2xl font-bold">Correct</h2>
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
          <div className="wrong">
            <h2 className="text-2xl font-bold">Wrong</h2>
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
          <div className="skipped">
            <h2 className="text-2xl font-bold">Skipped</h2>
            {data.skipped.map((player) => {
              const playerName = Object.keys(player)[0]
              return (
                // TODO: Separate component
                <div
                  key={playerName}
                  className="player-result-card flex items-center justify-center gap-2"
                >
                  <h3>{formatNameFirstLastName(playerName)}</h3>
                  <p
                    className={`${
                      player[playerName].cCorrectStreak > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {player[playerName].cCorrectStreak > 0
                      ? player[playerName].cCorrectStreak
                      : player[playerName].cWrongStreak}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="flex gap-6">
            <button
              onClick={handleBackToMainMenu}
              className="rounded-md bg-red-500 px-4 py-2"
            >
              Main Menu
            </button>
            <button
              onClick={handleContinueGame}
              className="rounded-md bg-green-500 px-4 py-2"
            >
              Next Lyric {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  return createPortal(children, modalContainer)
}
