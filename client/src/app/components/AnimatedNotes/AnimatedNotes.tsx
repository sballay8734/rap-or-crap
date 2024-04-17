import { createPortal } from "react-dom"

// mTODO: Remove conditional render (use opacity and pointer-events-none)
export default function AnimatedNotes() {
  const children = (
    <div className="absolute flex items-center justify-center pointer-events-none top-0 left-0 w-full h-full z-[1000]">
      <div className="absolute -translate-x-24 text-[10px] opacity-0 animate-music text-primary">
        &#9835;
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  return createPortal(children, modalContainer)
}
