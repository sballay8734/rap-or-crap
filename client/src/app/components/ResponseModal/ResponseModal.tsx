import { useDispatch, useSelector } from "react-redux"
import { createPortal } from "react-dom"

import { RootState } from "../../redux/store"
import { clearResponseMessage } from "../../redux/features/modals/responseModalSlice"
import { FaCheck } from "react-icons/fa6"
import { useEffect } from "react"

// TODO: Remove conditional render (use opacity and pointer-events-none)
export default function ResponseModal() {
  const dispatch = useDispatch()
  const { successResult, responseMessage } = useSelector(
    (state: RootState) => state.serverResponse
  )

  useEffect(() => {
    if (successResult !== null) {
      const timeoutId = setTimeout(() => {
        dispatch(clearResponseMessage())
      }, 1500)

      return () => clearTimeout(timeoutId)
    }
  }, [successResult])

  // * handle styling based on success or fail
  const icon = successResult === false ? "X" : <FaCheck />
  const msgColor = successResult === false ? "text-red-500" : "text-green-500"
  const messageBg = successResult === false ? "bg-red-200" : "bg-green-200"

  function handleCloseResponseModal() {
    dispatch(clearResponseMessage())
  }

  // if no message, show nothing
  if (!responseMessage) return null

  const children = (
    <div
      onClick={handleCloseResponseModal}
      className={`modal-background fixed inset-0 z-[1002] flex items-start justify-center bg-black/80 px-4 translate-y-20 ${
        successResult !== null ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal-content relative flex h-12 min-w-full overflow-hidden items-center justify-center gap-2 rounded-sm ${messageBg} ${msgColor} ${
          successResult !== null ? "translate-x-0" : "-translate-x-96"
        }`}
      >
        {responseMessage}
        {icon}
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  // Render it only if modalIsShown === true
  return createPortal(children, modalContainer)
}
