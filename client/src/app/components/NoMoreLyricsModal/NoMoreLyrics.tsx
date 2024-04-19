import { createPortal } from "react-dom"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { RootState } from "../../redux/store"
import { hideCacheModal } from "../../redux/features/modals/clearCacheModalSlice"
import {
  useDeleteGameMutation,
  useFetchActiveGameQuery
} from "../../redux/features/game/gameApi"
import { showScoreboard } from "../../redux/features/modals/scoreboardModalSlice"

export default function NoMoreLyricsModal() {
  const [deleteGame] = useDeleteGameMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { gameId } = useFetchActiveGameQuery("skip", {
    selectFromResult: ({ data }) => ({
      gameId: data?._id
    })
  })

  const modalIsShown = useSelector(
    (state: RootState) => state.cacheModal.isVisible
  )
  const modalMessage = useSelector(
    (state: RootState) => state.cacheModal.message
  )

  function goHome() {
    dispatch(hideCacheModal())
    navigate("/home")
  }

  async function handleCacheClear() {
    if (gameId) {
      await deleteGame()
    } else {
      console.error("Something went wrong.")
    }
    // if successful
    navigate("/home")
    dispatch(hideCacheModal())
  }

  // Modal to render
  const children = (
    <div
      className={`cache-modal-container fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 px-4 transition-opacity duration-200 ${
        modalIsShown ? "opacity-100" : "opacity-0 pointer-events-none"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content relative flex min-h-72 flex-col overflow-hidden rounded-3xl bg-surface border border-warning max-w-[500px]"
      >
        <div
          className="modal-header relative w-full flex-grow min-h-24 bg-warning"
          style={{
            backgroundImage: "url('/warning.png')",
            backgroundPosition: "center",
            backgroundSize: "50px 50px",
            backgroundRepeat: "no-repeat"
          }}
        ></div>
        <div className="flex flex-grow flex-col items-center justify-between px-4 py-4">
          <h2 className="text-2xl font-bold text-warning">Out of lyrics!</h2>
          <p className="text-[#4b4b4b] text-[0.6rem] text-center py-2 max-w-[300px]">
            Don't worry, we're working on more. If you'd like, you can clear the
            cache and play again with lyrics you've already seen.
          </p>
          <p className="rounded-md px-3 pb-2 text-center text-sm font-bold text-red-500 opacity-90">
            {modalMessage}
          </p>
          <div className="flex gap-6">
            <button
              onClick={handleCacheClear}
              className="rounded-md bg-warning px-6 py-2"
            >
              Yes
            </button>
            <button
              onClick={goHome}
              className="rounded-md border-[1px] border-warning px-4 py-2 text-warning"
            >
              Nah. Go home
            </button>
          </div>
          <button
            className="bg-green-500 mt-3 px-4 py-2"
            onClick={() => dispatch(showScoreboard())}
          >
            View Scoreboard
          </button>
        </div>
      </div>
    </div>
  )

  // Where to render modal
  const modalContainer = document.getElementById("modal-container")!

  // Render it only if modalIsShown === true
  return createPortal(children, modalContainer)
}
