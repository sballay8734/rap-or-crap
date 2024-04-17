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
  const {
    isVisible,
    data: { completedPrompt, correctPlayers, wrongPlayers, skipped }
  } = useSelector((state: RootState) => state.resultModal)

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
        className="modal-content relative flex flex-col overflow-hidden rounded-md bg-[#232323] border border-surfaceLighter max-w-[700px]"
      >
        {/* HEADER */}
        <div className="header p-4 flex flex-col gap-2">
          <h2
            className={`text-primary text-center text-5xl font-startGame relative ${
              completedPrompt?.correctAnswer === "crap" ? "text-red-500" : ""
            }`}
          >
            {completedPrompt?.correctAnswer.toLocaleUpperCase()}
            {completedPrompt?.correctAnswer === "crap" && (
              <>
                <img
                  className="absolute top-0 left-0 h-10 w-10"
                  src="/poop.png"
                  alt=""
                />
                <img
                  className="absolute top-0 right-0 h-10 w-10 -scale-x-100"
                  src="/poop.png"
                  alt=""
                />
              </>
            )}
          </h2>
          <p
            className={`lyric bg-[#3b393d] text-[#9d9d9d] text-xs font-light p-4 rounded-md flex flex-col items-center shadow-main border border-[#616161] ${
              completedPrompt?.correctAnswer === "rap" && "pb-2"
            }`}
          >
            <span className="text-center">"{completedPrompt?.lyric}"</span>
            {completedPrompt?.artistName === null ? null : (
              <span className="text-end w-full text-primary">
                - {completedPrompt?.artistName}
              </span>
            )}
          </p>
        </div>
        {/* BODY */}
        <div className="body px-4 flex flex-col gap-4 pb-4">
          <div className="correct flex flex-col items-start">
            <h2 className="text-black text-sm font-light text-center w-full bg-primary rounded-sm py-1 rounded-br-none rounded-bl-none">
              Safe
            </h2>
            <div className="flex gap-2 flex-wrap justify-center w-full bg-primary/20 py-2 rounded-b-lg">
              {correctPlayers.map((player) => {
                const playerName = Object.keys(player)[0]
                return (
                  // mTODO: Separate component
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
          <div className="wrong flex flex-col items-start relative">
            <h2 className="text-black text-sm font-light w-full text-center bg-red-500 rounded-sm py-1 rounded-br-none rounded-bl-none flex items-center justify-center gap-4">
              <img src="/cheers.png" alt="" className="h-4 w-4" />
              Drink
              <img src="/cheers.png" alt="" className="h-4 w-4" />
            </h2>
            <div className="flex gap-2 flex-wrap justify-center w-full bg-red-500/20 py-2 rounded-b-lg">
              {wrongPlayers.map((player) => {
                const playerName = Object.keys(player)[0]
                return (
                  // mTODO: Separate component
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
            {completedPrompt?.correctAnswer === "rap" ? (
              <>
                <TbWorld className="text-[#767676]" size={14} />
                <span className="text-[#767676] font-extralight text-xs flex gap-1">
                  Don't believe it's real?
                  <a
                    className="text-secondary animate-pulse"
                    target="_blank"
                    href={`${completedPrompt.youtubeUrl}`}
                  >
                    Click here
                  </a>
                </span>
              </>
            ) : (
              <span className="text-[#767676] font-extralight text-xs">
                That's crap dudes. Thanks for the compliment.
              </span>
            )}
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
              <FaCaretRight size={20} className="animate-skeleton" />
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
