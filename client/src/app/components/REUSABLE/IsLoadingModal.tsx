import { createPortal } from "react-dom"
import { useSelector } from "react-redux"

import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { RootState } from "../../redux/store"

export default function IsLoadingModal() {
  const modalIsShown = useSelector(
    (state: RootState) => state.loadingModal.isVisible
  )
  const modalMessage = useSelector(
    (state: RootState) => state.loadingModal.message
  )

  console.log(modalIsShown)
  // Modal to render
  const children = (
    <div
      className={`modal-background fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 px-4 transition-opacity duration-200 ${
        modalIsShown ? "opacity-100" : "opacity-0 pointer-events-none"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-w-full flex-col overflow-hidden rounded-3xl text-white items-center gap-4"
      >
        <span>{modalMessage}</span>
        <span className="animate-spin">
          <AiOutlineLoading3Quarters size={20} />
        </span>
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  // Render only if modalIsShown === true
  return createPortal(children, modalContainer)
}
