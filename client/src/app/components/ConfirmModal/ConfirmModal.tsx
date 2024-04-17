import { createPortal } from "react-dom"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { RootState } from "../../redux/store"
import { hideConfirmModal } from "../../redux/features/modals/confirmModalSlice"
import { IoMdCloseCircle } from "react-icons/io"
import { useDeleteGameMutation } from "../../redux/features/game/gameApi"

export default function ConfirmModal() {
  const [deleteGame] = useDeleteGameMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const modalIsShown = useSelector(
    (state: RootState) => state.confirmModal.isVisible
  )
  const modalMessage = useSelector(
    (state: RootState) => state.confirmModal.message
  )
  const modalDetails = useSelector(
    (state: RootState) => state.confirmModal.details
  )

  function closeModal() {
    dispatch(hideConfirmModal())
  }

  async function handleInitializeGame() {
    try {
      await deleteGame()
      navigate("/game/setup")
      closeModal()
    } catch (error) {
      console.error(error)
    }
  }

  // Modal to render
  const children = (
    <div
      onClick={closeModal}
      className={`confirm-modal-container fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 px-4 transition-opacity duration-200 ${
        modalIsShown ? "opacity-100" : "opacity-0 pointer-events-none"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-h-72 flex-col overflow-hidden rounded-3xl bg-surface border border-warning max-w-[500px]"
      >
        <div
          className="modal-header relative w-full flex-[2_0_33%] bg-warning"
          style={{
            backgroundImage: "url('/warning.png')",
            backgroundPosition: "center",
            backgroundSize: "50px 50px",
            backgroundRepeat: "no-repeat"
          }}
        >
          <button
            className="absolute right-5 top-4 rounded-full bg-warning"
            onClick={closeModal}
          >
            <IoMdCloseCircle size={30} className="text-warningDark" />
          </button>
        </div>
        <div className="flex flex-[1_0_67%] flex-col items-center justify-between px-4 py-4">
          <h2 className="text-2xl font-bold text-warning">Hang On a Sec!</h2>
          {modalDetails.length > 0 && (
            <p className="w-3/4 text-center text-xs opacity-50 text-faded">
              {modalDetails}
            </p>
          )}
          <p className="rounded-md px-3 pb-1 text-center text-sm font-bold text-red-500 opacity-90">
            {modalMessage}
          </p>
          <div className="flex gap-6">
            <button
              onClick={handleInitializeGame}
              className="rounded-md bg-warning px-6 py-2"
            >
              Yes
            </button>
            <button
              onClick={closeModal}
              className="rounded-md border-[1px] border-warning px-4 py-2 text-warning"
            >
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
  return createPortal(children, modalContainer)
}
