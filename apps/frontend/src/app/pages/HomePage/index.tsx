// TODO: Move requests to Api to handle loading states (signOut)
// TODO: Modal animation
//        ! Use a third party library for modal animations (the problem you're having is controlling the hiding of the modal since the state is being set to null. If it's null, the modal is immdiately removed from the DOM. So either use a 3rd party library or find a way to NOT use "null" and change how you're deciding to render the modal)

// TODO: Modal should accept a duration so you can more easily control it
// TODO: Write login logic
// TODO: Buttons need hover & active effects and stuff

import { useNavigate } from "react-router-dom";

import { IoMdSettings } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { ImSpinner11, ImSpinner2 } from "react-icons/im";
import { useDispatch } from "react-redux";
import { showConfirmModal } from "../../redux/ConfirmModalSlice";
import { setResponseMessage } from "../../redux/serverResponseSlice";
import { useSignoutMutation } from "../../redux/auth/authApi";
import { signOutUser } from "../../redux/UserSlice";
import { persistor } from "../../redux/store";

export default function HomePage() {
  const [signOut, { isLoading }] = useSignoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODO: Check to see if they already have an active game
  // TEMP CONSTANTS FOR TESTING
  const activeGame = true;
  const userName = "Shawn";

  // TODO: NEED TO LINK THE SELECTION OF "I'm Sure" to somehow start game
  function handleNewGame() {
    if (activeGame) {
      dispatch(
        showConfirmModal({
          details:
            "Starting a new game will delete your previous game forever!",
          message: "Are you sure you want to do this?",
        }),
      );
      return;
    }

    navigate("/game-setup");
  }

  // TODO: NEED TO TYPE THE RESPONSES HERE (SEE API)
  async function handleSignout() {
    const res = await signOut();
    console.log(res);
    if (res.error) {
      dispatch(
        setResponseMessage({
          successResult: false,
          message: res.error.data.message,
        }),
      );
      return;
    }

    // ! *****************************************************************
    // ! *****************************************************************
    // ! *****************************************************************
    // ! FIXME: PURGE IS NOT WORKING
    // ! *****************************************************************
    // ! *****************************************************************
    // ! *****************************************************************
    await persistor.purge();
    console.log("Persisted data cleared!");
    // dispatch(signOutUser());
    // localStorage.clear();
    // dispatch(
    //   setResponseMessage({
    //     successResult: true,
    //     message: res.data.message,
    //   }),
    // );
    navigate("/signin");
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
          <button
            onClick={handleSignout}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-red-700 bg-gray-900/10 px-4 py-3"
            type="submit"
          >
            {isLoading ? <ImSpinner2 className="animate-spin" /> : "SIGNOUT"}
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
          <button
            onClick={handleSignout}
            className="relative flex w-full items-center justify-center rounded-sm border-[1px] border-red-700 bg-gray-900/10 px-4 py-3"
            type="submit"
          >
            {isLoading ? <ImSpinner2 className="animate-spin" /> : "SIGNOUT"}
          </button>
        </div>
      )}
    </div>
  );
}
