import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { RootState } from "../../redux/store"

import { IoClose } from "react-icons/io5"
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
    index: number
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
    if (notification.isVisible) {
      const timeoutId = setTimeout(() => {
        dispatch(hideModal(notification.modalId))
      }, 1500)

      return () => clearTimeout(timeoutId)
    }
  }, [isVisible, isSuccess])

  return (
    <div
      // REMEMBER: onTransitionEnd is a godsend for smooth transitions
      onTransitionEnd={handleTransitionEnd}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: `${notification.index * 55}px`
      }}
      className={`modal-content flex h-12 min-w-[95%] overflow-hidden items-center justify-center gap-4 rounded-sm bg-gray-900 text-gray-200 -translate-x-96 transition-translate duration-200 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "-translate-x-[1000px] opacity-0"
      } ${
        // BUG: When isSuccess switches to "null", the color changes to red because "null" is not "true"
        isSuccess
          ? "bg-green-900/90 text-green-500"
          : "bg-red-900/90 text-red-500"
      }`}
    >
      <span>{message}</span>
      {isSuccess ? <FaCheck color="green" /> : <IoClose color="red" />}
    </div>
  )
}
