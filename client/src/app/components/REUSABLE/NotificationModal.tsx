import { createPortal } from "react-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { RootState } from "../../redux/store"

import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaCheck } from "react-icons/fa6"
import { removeModal } from "../../redux/features/modals/handleModalsSlice"

interface ModalProps {
  notification: {
    modalId: string
    isVisible: boolean
    isSuccess: boolean | null
    message: string | null
  }
}

export default function NotificationModal({ notification }: ModalProps) {
  const dispatch = useDispatch()
  // grabs specific modal using the id from redux
  const { isVisible, isSuccess, message } = useSelector(
    (state: RootState) =>
      state.notifyModals.modalsToRender[notification.modalId]
  )

  useEffect(() => {
    console.log(isSuccess)
    if (isSuccess !== null) {
      const timeoutId = setTimeout(() => {
        dispatch(removeModal(notification.modalId))
      }, 1500)

      return () => clearTimeout(timeoutId)
    }
  }, [isSuccess])

  console.log(isVisible)
  console.log("RENDERING...")

  // Modal to render
  const children = (
    <div
      className={`modal-background fixed inset-0 z-[1001] flex items-start justify-center bg-black/80 px-4 mt-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal-content relative flex h-12 min-w-full overflow-hidden items-center justify-center gap-4 rounded-sm bg-gray-900 text-gray-200 -translate-x-96 transition-translate duration-200 ${
          isVisible ? "translate-x-0" : "-translate-x-96"
        }`}
      >
        <span>{message}</span>
        {isSuccess ? (
          <FaCheck color="green" />
        ) : (
          <span className="animate-spin">
            <AiOutlineLoading3Quarters />
          </span>
        )}
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  // Render it only if modalIsShown === true
  return createPortal(children, modalContainer)
}
