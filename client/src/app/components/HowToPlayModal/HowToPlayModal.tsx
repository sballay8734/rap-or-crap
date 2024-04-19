import { createPortal } from "react-dom"
import { RootState } from "../../redux/store"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { hideRules } from "../../redux/features/modals/howToPlayModalSlice"
import { suggestions } from "./suggestions"

export default function HowToPlayModal() {
  const dispatch = useDispatch()
  const isVisible = useSelector(
    (state: RootState) => state.howToPlayModal.isVisible
  )
  // Modal to render
  const children = (
    <div
      className={`scoreboard-modal-container fixed inset-0 z-[1002] flex flex-col items-center justify-center bg-black/80 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-full"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal-content abosolute flex min-h-full min-w-full flex-col overflow-hidden bg-surface justify-between`}
      >
        <div className="header flex flex-col items-center justify-center gap-2 h-1/5 bg-secondary">
          <h1 className="text-2xl">How to Play</h1>
        </div>
        <div className="flex gap-2 flex-col w-full items-center text-white">
          {suggestions.map((suggestion) => {
            return (
              <div
                className="bg-[#1f1f1f] rounded-md max-w-[95%] p-2 border border-[#333333]"
                key={suggestion.number}
              >
                {/* WARNING: Make sure to use full tailwind classes here */}
                <h2
                  className={`label text-xl text-red-500 relative w-full mb-2`}
                >
                  {suggestion.label}
                  <span className="absolute p-1 top-0 right-0 text-xs text-blue-300">
                    {suggestion.type}
                  </span>
                </h2>
                <p className="description">{suggestion.description}</p>
              </div>
            )
          })}
        </div>
        <button
          className="bg-secondary min-h-20 text-black"
          onClick={() => dispatch(hideRules())}
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

// Max 10 players

// Naturally, some players will know that certain lyrics are real. It's best not to divulge this information since exclaiming you've heard a lyric tells everyone the answer.

// Take turns reading the lyrics. Rap them if you're feeling freaky. It's always funny listening to other players try and work out the cadence!
