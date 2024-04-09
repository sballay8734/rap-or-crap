// TODO: Shrink text and icons to fit on smaller screens
// TODO: Musical note raining animation

import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

import { IoMdSettings } from "react-icons/io"
import { FaPlay } from "react-icons/fa"
import { ImSpinner11 } from "react-icons/im"
import { showConfirmModal } from "../../redux/features/modals/confirmModalSlice"
import { useSignoutMutation } from "../../redux/features/auth/authApi"
import { useFetchActiveGameQuery } from "../../redux/features/game/gameApi"
import { setResponseMessage } from "../../redux/features/modals/responseModalSlice"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

export default function HomePage() {
  const [signout] = useSignoutMutation()
  const user = useSelector((state: RootState) => state.user.user)

  const modalVisible = useSelector(
    (state: RootState) =>
      (state.notifyModals.modalsToRender["signin"]?.isVisible ||
        state.notifyModals.modalsToRender["fetchActiveGame"]?.isVisible) ??
      false
  )

  // HACK: localGameId is a temporary workaround for poor query structure
  const localGameId = useSelector((state: RootState) => state.game.localGameId)

  const { data: activeGame, isLoading } = useFetchActiveGameQuery(
    {
      gameId: localGameId,
      flag: "skip"
    },
    {
      skip: !user
    }
  )

  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleResumeGame() {
    if (activeGame !== null) {
      navigate("/game")
    } else {
      dispatch(
        setResponseMessage({
          successResult: false,
          message: "Hmmm... You shouldn't be able to do that..."
        })
      )
    }
  }

  function handleNewGame() {
    if (activeGame) {
      dispatch(
        showConfirmModal({
          details:
            "Starting a new game will delete your previous game forever!",
          message: "Delete your old game forever?"
        })
      )
      return
    }

    // If active game is null/undefined go to game setup, don't show modal
    navigate("/game-setup")
  }

  async function handleSignout() {
    try {
      const res = await signout()
      if ("data" in res) {
        navigate("/signin")
      }
    } catch (error) {
      console.error("Something went wrong")
    }
  }

  // TODO: Refactor this entire section and add transitions/animations
  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center px-6 py-8 text-white">
      <div className="flex h-3/4 flex-col items-center">
        <p className="text-xl font-extralight tracking-wider text-heroP">
          Hi {user?.displayName}!
        </p>
        <h1 className="flex items-center text-center text-7xl font-display tracking-wider flex-grow mt-10 text-white">
          RAP OR CRAP
        </h1>
        <p className="text-center font-light text-sm max-w-[80%] text-heroP">
          A game that might just convince you that you've got what it takes to
          be a rapper.
        </p>
        <div className="flex flex-grow items-center">
          <img
            src="/musicNote.png"
            alt=""
            className="w-40 h-40 flex items-center justify-center brightness-50"
          />
        </div>
      </div>
      {isLoading === true ? (
        <div>Loading...</div>
      ) : activeGame !== null && activeGame !== undefined ? (
        <div className="flex flex-grow w-full flex-col items-center gap-4 justify-end">
          <button
            onClick={handleResumeGame}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-primary text-primary px-4 py-3 bg-black"
          >
            Resume Game <ImSpinner11 className="absolute right-4" />
          </button>
          <button
            onClick={handleNewGame}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-primary text-primary px-4 py-3 bg-black"
          >
            New Game <FaPlay className="absolute right-4" />
          </button>
          <button className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-primary text-primary px-4 py-3 bg-black">
            Rules <IoMdSettings size={18} className="absolute right-4" />
          </button>
          <button
            onClick={handleSignout}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-transparent text-black bg-error px-4 py-3 h-12"
            type="submit"
            disabled={modalVisible}
          >
            {modalVisible ? (
              <span className="animate-spin">
                <AiOutlineLoading3Quarters size={18} />
              </span>
            ) : (
              "SIGN OUT"
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-grow w-full flex-col items-center gap-4 justify-end">
          <button
            onClick={handleNewGame}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-primary text-primary px-4 py-3 bg-black"
          >
            New Game <FaPlay className="absolute right-4" />
          </button>
          <button className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-primary text-primary px-4 py-3 bg-black">
            Rules <IoMdSettings size={18} className="absolute right-4" />
          </button>
          <button
            onClick={handleSignout}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-transparent text-black bg-error px-4 py-3 h-12"
            type="submit"
            disabled={modalVisible}
          >
            {modalVisible ? (
              <span className="animate-spin">
                <AiOutlineLoading3Quarters size={18} />
              </span>
            ) : (
              "SIGN OUT"
            )}
          </button>
        </div>
      )}

      {/* ANIMATED NOTES */}
      <div className="absolute flex items-center justify-center pointer-events-none top-0 left-0 w-full h-full z-[2000]">
        <div className="absolute -translate-x-24 text-[10px] opacity-0 animate-music text-primary">
          &#9835;
        </div>
      </div>
    </div>
  )
}
