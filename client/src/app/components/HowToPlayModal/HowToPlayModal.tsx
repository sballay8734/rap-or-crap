import { createPortal } from "react-dom"
import { RootState } from "../../redux/store"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { hideRules } from "../../redux/features/modals/howToPlayModalSlice"
import { suggestions } from "./suggestions"
import { IoWarning } from "react-icons/io5"

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
        className={`modal-content abosolute flex min-h-full min-w-full flex-col overflow-hidden bg-surface justify-between items-center`}
      >
        <div className="bg-transparent pt-6 px-6 pb-4 flex flex-col justify-between min-w-full">
          <div className="flex flex-grow gap-5 items-center justify-center">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-5xl text-center font-startGame font-bold text-black border border-primaryInactive py-2 rounded-md bg-primary">
                HOW TO PLAY
              </h2>
            </div>
            <div className="flex-shrink-0">
              <img src="/question.png" alt="" className="w-24 h-24" />
            </div>
          </div>
        </div>
        {/* SPACER ********************************************************* */}
        <div className="spacer bg-transparent h-1 rounded-full w-full px-4 max-w-[800px]">
          <div className="spacer bg-surfaceLighter h-[2px] rounded-full w-full"></div>
        </div>
        <div className="flex gap-2 flex-col w-full items-center text-white py-2 px-2 flex-grow max-w-[800px] justify-center">
          {suggestions.map((suggestion) => {
            if (suggestion.type === "list" && suggestion.elements) {
              return (
                <div
                  key={suggestion.label}
                  className="bg-[#1c1c1c] rounded-md p-2 border border-[#333333] w-full flex gap-2 flex-col flex-grow overflow-y-scroll no-scrollbar"
                >
                  <h2 className="text-center text-2xl border border-[#3d1b1b] py-2 rounded-lg bg-[#4f2323] text-white font-quote">
                    Suggestions
                  </h2>
                  {suggestion.elements.map((item) => {
                    return (
                      <div className="w-full" key={item.label}>
                        <h2
                          className={`label text-normal ${item.textColor} relative w-full flex items-center gap-1`}
                        >
                          {item.showIcon && (
                            <IoWarning className="animate-pulse" />
                          )}
                          {item.label}
                        </h2>
                        <p className="description text-xs font-light text-[#c4c4c4]">
                          {item.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            }
            return (
              <div
                className={`${suggestion.bgColor} rounded-md p-2 border border-[#333333] w-full`}
                key={suggestion.number}
              >
                <h2
                  className={`label text-2xl ${suggestion.textColor} relative w-full mb-1 font-quote`}
                >
                  {suggestion.label}
                </h2>
                <p className="description text-sm font-semibold text-[#e8e8e8]">
                  {suggestion.description}
                </p>
              </div>
            )
          })}
        </div>
        <button
          className="bg-secondary min-h-20 text-black w-full"
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
