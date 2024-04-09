import { memo, useEffect } from "react"
import { useDispatch } from "react-redux"

import { IoClose } from "react-icons/io5"
import { FaCheck } from "react-icons/fa6"
import {
  hideModal,
  removeModal
} from "../../redux/features/modals/handleModalsSlice"
import { createPortal } from "react-dom"

interface ModalProps {
  modalId: string
  isVisible: boolean
  isSuccess: boolean | null
  message: string | null
  modalIndex: number
}

const NotificationModal = memo(
  function NotificationModal({
    modalId,
    isVisible,
    isSuccess,
    message,
    modalIndex
  }: ModalProps) {
    const dispatch = useDispatch()
    // Removes modal from store to prevent index problems AFTER transition ends
    function handleTransitionEnd() {
      if (!isVisible) {
        dispatch(removeModal(modalId))
      }
    }

    // Hides modal for smooth transition
    useEffect(() => {
      if (isVisible) {
        const timeoutId = setTimeout(() => {
          dispatch(hideModal(modalId))
        }, 1500)

        return () => clearTimeout(timeoutId)
      }
    }, [isVisible, isSuccess])

    const modal = (
      <div
        // REMEMBER: onTransitionEnd is a godsend for smooth transitions
        onTransitionEnd={handleTransitionEnd}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${8 + modalIndex * 55}px`,
          margin: "0 auto"
        }}
        className={`notify-modal flex h-12 w-[95%] overflow-hidden items-center justify-center gap-4 rounded-sm bg-gray-900 text-gray-200 -translate-x-96 transition-translate duration-200 z-[1003] ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-[1000px] opacity-0"
        } ${
          isSuccess
            ? "bg-green-900/90 text-green-500"
            : "bg-red-900/90 text-red-500"
        }`}
      >
        <span>{message}</span>
        {isSuccess ? <FaCheck color="green" /> : <IoClose color="red" />}
      </div>
    )
    // Where to render modal
    const modalContainer = document.getElementById("modal-container")!

    // Render it only if modalIsShown === true
    return createPortal(modal, modalContainer)
  },
  (prevProps, newProps) => {
    return (
      prevProps.modalIndex === newProps.modalIndex &&
      prevProps.isVisible === newProps.isVisible
    )
  }
)

export default NotificationModal
