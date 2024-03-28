import { useState } from "react"
import { createPortal } from "react-dom"

export default function ResultModal() {
  const [modalIsShown, setModalIsShown] = useState<boolean>(false)

  // Modal to render
  const children = (
    <div className="modal-background fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-h-72 min-w-full flex-col overflow-hidden rounded-3xl bg-white"
      >
        <div
          className="modal-header relative w-full flex-[2_0_33%] bg-yellow-500"
          style={{
            backgroundImage: "url('warning.png')",
            backgroundPosition: "center",
            backgroundSize: "50px 50px",
            backgroundRepeat: "no-repeat"
          }}
        >
          <button className="absolute right-5 top-4 rounded-full bg-yellow-500">
            ICON
          </button>
        </div>
        <div className="flex flex-[1_0_67%] flex-col items-center justify-between px-4 py-4">
          <h2 className="text-2xl font-bold">Hang On a Sec!</h2>
          <p className="rounded-md bg-red-200 px-3 py-1 text-center text-sm font-bold text-red-500 opacity-90"></p>
          <div className="flex gap-6">
            <button className="rounded-md bg-yellow-500 px-4 py-2">
              I'm Sure
            </button>
            <button className="rounded-md border-[1px] border-yellow-500 px-4 py-2">
              I'll Reconsider
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  // Render it only if modalIsShown === true
  return modalIsShown && createPortal(children, modalContainer)
}
