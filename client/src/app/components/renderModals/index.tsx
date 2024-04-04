import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import NotificationModal from "../reusable/NotificationModal"
import { createPortal } from "react-dom"

export function RenderModals() {
  const notifyModals = useSelector(
    (state: RootState) => state.notifyModals.modalsToRender
  )
  // Transform notifyModals to an array
  const modalsToRender = Object.entries(notifyModals)
    // .filter(([_, data]) => data.isVisible === true)
    .map(([modalId, data]) => ({ modalId, ...data }))

  console.log("LENGTH:", modalsToRender.length)

  // FIXME: filter is not working properly. This code works. But length continues to increase. Need to debug filter function.
  const children = (
    <div
      className={`modal-background fixed inset-0 z-[1001] flex flex-col gap-2 items-center justify-start px-4 mt-4 transition-opacity duration-300 pointer-events-none ${
        modalsToRender.length > 0
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {modalsToRender.map((notification, index) => {
        return <NotificationModal key={index} notification={notification} />
      })}
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  // Render it only if modalIsShown === true
  return createPortal(children, modalContainer)
}
