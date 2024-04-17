import { memo, useEffect } from "react"
import { useDispatch } from "react-redux"

import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline
} from "react-icons/io"

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

    // Hides AND REMOVES modal for smooth transition
    useEffect(() => {
      if (isVisible) {
        const timeoutId = setTimeout(() => {
          dispatch(hideModal(modalId))
          // REVIEW: This might not be ideal but it does work.
          setTimeout(() => {
            console.log("Running remove...", modalId)
            dispatch(removeModal(modalId))
          }, 500)
        }, 1500)

        return () => clearTimeout(timeoutId)
      }
    }, [isVisible])

    const modal = (
      <div
        // REMEMBER: onTransitionEnd CAN be good for smooth transitions but also can be a bit tricky to deal with
        onTransitionEnd={handleTransitionEnd}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${11 + modalIndex * 72}px`,
          margin: "0 auto"
        }}
        className={`notify-modal flex h-16 w-[95%] overflow-hidden items-center rounded-md bg-test text-gray-200 -translate-x-96 transition-translate duration-200 z-[1003] ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-[1000px] opacity-0"
        } ${isSuccess ? "border border-success" : "border border-error"}`}
      >
        <div
          className={`icon h-full flex items-center justify-center min-w-16 ${
            isSuccess ? "bg-success" : "bg-error"
          }`}
        >
          {isSuccess ? (
            <IoIosCheckmarkCircleOutline size={35} color={"#FFFFFF"} />
          ) : (
            <IoIosCloseCircleOutline size={35} color={"#FFFFFF"} />
          )}
        </div>
        <div className="message flex flex-col leading-tight justify-center w-full pl-3">
          <h2
            className={`text-md text-black font-light ${
              isSuccess ? "text-success" : "text-error"
            }`}
          >
            {isSuccess ? "Success!" : "Error"}
          </h2>
          <p className="text-xs font-extralight text-faded">{message}</p>
        </div>
        <button
          onClick={() => dispatch(hideModal(modalId))}
          className="close text-[9px] min-w-16 flex items-center justify-center text-faded font-light tracking-wider border-l border-[#2b2b2b] h-[75%]"
        >
          CLOSE
        </button>
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
