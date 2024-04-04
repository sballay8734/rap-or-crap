import { createPortal } from "react-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { RootState } from "../../redux/store"

import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaCheck } from "react-icons/fa6"
import {
  hideModal,
  removeModal
} from "../../redux/features/modals/handleModalsSlice"

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
  // grabs specific modal using the id from store (handleModalSlice)
  const { isVisible, isSuccess, message } = useSelector(
    (state: RootState) =>
      state.notifyModals.modalsToRender[notification.modalId]
  )

  // Removes modal from store to prevent index problems AFTER transition ends
  function handleTransitionEnd() {
    if (!notification.isVisible) {
      dispatch(removeModal(notification.modalId))
    }
  }

  // Hides modal for smooth transition
  useEffect(() => {
    if (true) {
      const timeoutId = setTimeout(() => {
        dispatch(hideModal(notification.modalId))
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [isVisible, isSuccess])

  return (
    <div
      // REMEMBER: onTransitionEnd is a godsend for smooth transitions
      onTransitionEnd={handleTransitionEnd}
      onClick={(e) => e.stopPropagation()}
      className={`modal-content relative flex h-12 min-w-full overflow-hidden items-center justify-center gap-4 rounded-sm bg-gray-900 text-gray-200 -translate-x-96 transition-translate duration-200 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "-translate-x-[1000px] opacity-0"
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
  )
}
