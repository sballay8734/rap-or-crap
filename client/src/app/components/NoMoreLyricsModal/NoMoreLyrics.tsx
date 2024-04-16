import { createPortal } from "react-dom"

import { useNavigate } from "react-router-dom"

// TODO: slice for vis/notVis, cache clear (seenPrompts)

export default function NoMoreLyricsModal() {
  const navigate = useNavigate()

  // REMOVE: Testing only
  const modalIsShown = false

  function goHome() {
    console.log("Close Modal")
    navigate("/home")
  }

  const modalMessage = "Clear the cache and start again?"

  // Modal to render
  const children = (
    <div
      className={`confirm-modal-container fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 px-4 transition-opacity duration-200 ${
        modalIsShown ? "opacity-100" : "opacity-0 pointer-events-none"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-h-72 min-w-full flex-col overflow-hidden rounded-3xl bg-surface border border-warning"
      >
        <div
          className="modal-header relative w-full flex-[2_0_33%] bg-warning"
          style={{
            backgroundImage: "url('/warning.png')",
            backgroundPosition: "center",
            backgroundSize: "50px 50px",
            backgroundRepeat: "no-repeat"
          }}
        ></div>
        <div className="flex flex-[1_0_67%] flex-col items-center justify-between px-4 py-4">
          <h2 className="text-2xl font-bold text-warning">Out of lyrics!</h2>
          <p className="text-[#4b4b4b] text-[10px] text-center py-2">
            Don't worry, we're working on more. If you'd like, you can clear the
            cache and play again with lyrics you've already seen.
          </p>
          <p className="rounded-md px-3 pb-2 text-center text-sm font-bold text-red-500 opacity-90">
            {modalMessage}
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => console.log("Clearing cache")}
              className="rounded-md bg-warning px-6 py-2"
            >
              Yes
            </button>
            <button
              onClick={goHome}
              className="rounded-md border-[1px] border-warning px-4 py-2 text-warning"
            >
              Nah. Go home
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  // Render it only if modalIsShown === true
  return createPortal(children, modalContainer)
}
