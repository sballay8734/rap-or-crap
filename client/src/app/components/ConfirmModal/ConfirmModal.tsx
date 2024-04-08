import { createPortal } from "react-dom"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { RootState } from "../../redux/store"
import { hideConfirmModal } from "../../redux/features/modals/confirmModalSlice"
import { IoMdCloseCircle } from "react-icons/io"
import { useDeleteGameMutation } from "../../redux/features/game/gameApi"
import { setResponseMessage } from "../../redux/features/modals/responseModalSlice"

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
      navigate("/game-setup")
      closeModal()
    } catch (error) {
      dispatch(
        setResponseMessage({
          successResult: false,
          message: "Something went wrong"
        })
      )
    }
  }

  // Modal to render
  const children = (
    <div
      onClick={closeModal}
      className={`modal-background fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 px-4 transition-opacity duration-200 ${
        modalIsShown ? "opacity-100" : "opacity-0 pointer-events-none"
      } `}
    >
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
          <button
            className="absolute right-5 top-4 rounded-full bg-yellow-500"
            onClick={closeModal}
          >
            <IoMdCloseCircle size={30} className="text-white" />
          </button>
        </div>
        <div className="flex flex-[1_0_67%] flex-col items-center justify-between px-4 py-4">
          <h2 className="text-2xl font-bold">Hang On a Sec!</h2>
          {modalDetails.length > 0 && (
            <p className="w-3/4 text-center text-xs opacity-50">
              {modalDetails}
            </p>
          )}
          <p className="rounded-md bg-red-200 px-3 py-1 text-center text-sm font-bold text-red-500 opacity-90">
            {modalMessage}
          </p>
          <div className="flex gap-6">
            <button
              onClick={handleInitializeGame}
              className="rounded-md bg-yellow-500 px-4 py-2"
            >
              I'm Sure
            </button>
            <button
              onClick={closeModal}
              className="rounded-md border-[1px] border-yellow-500 px-4 py-2"
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
