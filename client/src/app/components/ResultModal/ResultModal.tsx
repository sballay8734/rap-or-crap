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
import { TbWorld } from "react-icons/tb"
import { FaCaretRight } from "react-icons/fa6"

export default function ResultModal() {
  const navigate = useNavigate()

  const { gameId, currentLyric } = useFetchActiveGameQuery("skip", {
    selectFromResult: ({ data }) => ({
      gameId: data?._id,
      currentLyric: data?.currentLyric
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

  // REMOVE: Testing
  const tempUrl = "https://youtu.be/UimodeZfA9o?t=225"

  // Modal to render
  const children = (
    <div
      className={`result-modal-container fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 px-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-w-full flex-col overflow-hidden rounded-md bg-[#232323] border border-surfaceLighter"
      >
        {/* HEADER */}
        <div className="header p-4 flex flex-col gap-2">
          <h2 className="text-offWhite text-center text-5xl font-startGame">
            RAP
          </h2>
          <p className="lyric bg-[#3b393d] text-[#9d9d9d] text-xs font-light p-4 pb-2 rounded-md flex flex-col items-center">
            <span className="text-center">"{currentLyric}"</span>
            <span className="text-end w-full text-primary">- Eminem</span>
          </p>
        </div>
        {/* BODY */}
        <div className="body px-4 flex flex-col gap-4 pb-4">
          <div className="correct flex flex-col items-start gap-2">
            <h2 className="text-black text-sm font-light text-center w-full bg-primary rounded-sm py-1">
              Safe
            </h2>
            <div className="flex gap-2 flex-wrap justify-center w-full">
              {data.correctPlayers.map((player) => {
                const playerName = Object.keys(player)[0]
                return (
                  // TODO: Separate component
                  <div
                    key={playerName}
                    className="player-result-card flex items-center justify-center gap-2"
                  >
                    <h3 className="text-offWhite font-light">
                      {formatNameFirstLastName(playerName)}
                    </h3>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="wrong flex flex-col items-start gap-2">
            <h2 className="text-black text-sm font-light w-full text-center bg-red-500 rounded-sm py-1">
              Drink
            </h2>
            <div className="flex gap-2 flex-wrap justify-center w-full">
              {data.wrongPlayers.map((player) => {
                const playerName = Object.keys(player)[0]
                return (
                  // TODO: Separate component
                  <div
                    key={playerName}
                    className="player-result-card flex items-center justify-center gap-2"
                  >
                    <h3 className="text-offWhite font-light">
                      {formatNameFirstLastName(playerName)}
                    </h3>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="linkToVid bg-[#191919] flex flex-col gap-4">
          <div className="top flex items-center gap-1 text-white font-light justify-center pt-4">
            <TbWorld className="text-[#767676]" size={14} />
            <span className="text-[#767676] font-extralight text-xs flex gap-1">
              Don't believe us?
              <a className="text-secondary" target="_blank" href={`${tempUrl}`}>
                Click here
              </a>
            </span>
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              onClick={handleBackToMainMenu}
              className="bg-[#3a3a3a] text-white py-4 px-4 w-1/2"
            >
              Home
            </button>
            <button
              onClick={handleContinueGame}
              className="bg-secondary text-black py-4 px-4 w-1/2 flex items-center justify-center"
            >
              Next Lyric
              <FaCaretRight
                size={20}
                className="translate-y-[1px] animate-skeleton"
              />
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
