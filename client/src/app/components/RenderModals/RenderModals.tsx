import { useSelector } from "react-redux"

import { RootState } from "../../redux/store"
// CAN'T FIND NOTIFICATION MODAL
import NotificationModal from "../Reusable/NotificationModal"

export function RenderModals() {
  const notifyModals = useSelector(
    (state: RootState) => state.notifyModals.modalsToRender
  )
  // Transform notifyModals to an array
  const modalsToRender = Object.entries(notifyModals).map(
    ([modalId, data]) => ({ modalId, ...data })
  )

  if (modalsToRender.length === 0) {
    return null
  }

  return modalsToRender.map((notification, index) => {
    const modalId = notification.modalId
    const isVisible = notification.isVisible
    const isSuccess = notification.isSuccess
    const message = notification.message
    const modalIndex = notification.index

    return (
      // <div className="fixed top-0 left-0 w-full h-full bg-black/50">
      <NotificationModal
        key={modalId + index.toString()}
        modalId={modalId}
        isVisible={isVisible}
        isSuccess={isSuccess}
        message={message}
        modalIndex={modalIndex}
      />
      // </div>
    )
  })
}
