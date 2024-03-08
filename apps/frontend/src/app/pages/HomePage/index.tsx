import { useNavigate } from "react-router-dom";

import { IoMdSettings } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { ImSpinner11 } from "react-icons/im";
import { useDispatch } from "react-redux";
import { showConfirmModal } from "../../redux/ConfirmModalSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // TODO: Check to see if they already have an active game
  // TEMP CONSTANTS FOR TESTING
  const activeGame = true;
  const userName = "Shawn";

  function handleNewGame() {
    if (activeGame) {
      dispatch(
        showConfirmModal({
          details:
            "Starting a new game will delete your previous game forever!",
          message: "Are you sure you want to start a new game?",
        }),
      );
      return;
    }

    navigate("/game-setup");
  }

  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center px-8 py-10 text-white">
      <div className="flex h-1/2 flex-col items-center">
        <p className="text-xl font-extralight tracking-wider text-gray-600">
          Hi {userName}!
        </p>
        <h1 className="flex flex-grow items-center text-center text-7xl">
          RAP OR CRAP
        </h1>
      </div>
      {activeGame ? (
        <div className="flex w-full flex-col items-center gap-4">
          <button className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-green-700 bg-gray-900/20 px-4 py-3">
            Resume Game <ImSpinner11 className="absolute right-4" />
          </button>
          <button
            onClick={handleNewGame}
            className="relative flex w-full items-center justify-center rounded-sm bg-green-700 px-4 py-3"
          >
            New Game <FaPlay className="absolute right-4" />
          </button>
          <button className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-green-700 bg-gray-900/20 px-4 py-3">
            Rules <IoMdSettings size={18} className="absolute right-4" />
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-4">
          <button
            onClick={handleNewGame}
            className="relative flex w-full items-center justify-center rounded-sm bg-green-700 px-4 py-3 active:opacity-90"
          >
            New Game <FaPlay className="absolute right-4" />
          </button>
          <button className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-green-700 bg-gray-900/20 px-4 py-3">
            Rules <IoMdSettings size={18} className="absolute right-4" />
          </button>
        </div>
      )}
    </div>
  );
}
