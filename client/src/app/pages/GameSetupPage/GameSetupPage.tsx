// TODO: Response messages that are errors, should render the rest of the screen unclickable until it is closed
// TODO: Need to refactor how response modals are rendered (Dispatching an initalize action is not ideal)

// TODO: Start Game text is too dark against surfaceBG
// TODO: Colored shadows are way to bright

import { ChangeEvent, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { setResponseMessage } from "../../redux/features/modals/responseModalSlice"
import { IoIosAdd, IoIosClose } from "react-icons/io"
import { FaCheckCircle } from "react-icons/fa"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import {
  IGameInstance,
  useInitializeGameMutation
} from "../../redux/features/game/gameApi"
import { RootState } from "../../redux/store"
import {
  addPlayer,
  clearPlayers,
  removePlayer
} from "../../redux/features/game/gameSlice"
import { FaArrowLeftLong } from "react-icons/fa6"
import { MdOutlinePersonAddAlt } from "react-icons/md"
import { addModal } from "../../redux/features/modals/handleModalsSlice"

import { IoPerson } from "react-icons/io5"
import { IoPersonOutline } from "react-icons/io5"

const MAX_PLAYERS = 10

export default function GameSetupPage() {
  const [initializeGame] = useInitializeGameMutation()

  const userId = useSelector((state: RootState) => state.user.user?._id)
  const players = useSelector((state: RootState) => state.game.playerList)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [input, setInput] = useState<string>("")

  // REMEMBER: Always call useEffect BEFORE any early returns
  // https://react.dev/warnings/invalid-hook-call-warning

  if (!userId) {
    return (
      <div className="z-1 relative flex h-screen w-full flex-col items-center justify-center gap-8 px-6 py-8 text-white">
        <h1 className="text-4xl text-center">You must be logged in!</h1>
      </div>
    )
  }

  function handleAddPlayer() {
    const error = validatePlayer(input)

    // store all names as lowercase for easier comparison (format name in jsx)
    if (!error) {
      dispatch(addPlayer(input.toLocaleLowerCase()))
      setInput("")
    } else {
      dispatch(
        addModal({
          modalId: "addPlayer",
          data: { isVisible: true, isSuccess: false, message: error }
        })
      )
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      handleAddPlayer()
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value)
  }

  function handleRemovePlayer(player: string) {
    dispatch(removePlayer(player))
  }

  function validatePlayer(name: string): string | null {
    console.log(players)
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long."
    }
    if (name.split(" ").length > 2) {
      return "First and last name only."
    }
    if (players.includes(input.toLocaleLowerCase())) {
      return "That player already exists."
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Name can only contain letters and spaces."
    }
    if (players.length >= MAX_PLAYERS) {
      return "Maximum number of players reached."
    }
    return null
  }

  async function handleStartGame() {
    if (players.length < 1) {
      dispatch(
        setResponseMessage({
          successResult: false,
          message: "At least one player is required."
        })
      )
      return
    }

    if (!userId) {
      dispatch(
        setResponseMessage({
          successResult: false,
          message: "You must be logged in!"
        })
      )
      return
    }

    const playersObject = Object.fromEntries(
      players.map((player) => [
        player,
        {
          // c = current
          // l will be for lifetime (but this is handled on server)
          cCorrect: 0,
          cWrong: 0,
          cDrinksTaken: 0,
          cDrinksGiven: 0,
          cCorrectStreak: 0,
          cWrongStreak: 0,
          lastQSkipped: false,
          lastQCorrect: false
        }
      ])
    )

    const fullGameObject: IGameInstance = {
      playersObject: { ...playersObject },
      userId: userId
    }

    dispatch(clearPlayers())

    try {
      const newGame = await initializeGame(fullGameObject)
      if ("data" in newGame) {
        navigate("/game")
        return
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  function handleAvatarRender() {
    const avatars = []
    for (let i = 0; i < MAX_PLAYERS; i++) {
      if (i < players.length) {
        avatars.push(<IoPerson key={i} className="text-secondary" />)
      } else {
        avatars.push(<IoPersonOutline key={i} className="text-secondary" />)
      }
    }

    return avatars
  }

  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center justify-between text-white bg-primaryInactive">
      <div className="header-and-list-wrapper flex flex-col flex-grow w-full bg-surface items-center overflow-auto">
        {/* HEADER ********************************************************* */}
        <div className="bg-transparent pt-8 px-6 pb-6 h-1/3 flex flex-col justify-betweenf flex-shrink-0">
          <div className="flex flex-grow">
            <div className="flex flex-col justify-between flex-grow">
              <button
                onClick={() => navigate(-1)}
                className="flex gap-2 items-center text-primaryLightest"
              >
                <FaArrowLeftLong size={20} />
              </button>
              <h2 className="text-2xl font-main font-bold text-lightGray">
                Let's go! Add players to begin.
              </h2>
              <div
                onClick={handleStartGame}
                className={`buttonWrapper flex gap-2 items-center p-2 rounded-md transition-all duration-200 ${
                  players.length > 1 ? "bg-primary" : "bg-disabledBtnBg"
                }`}
              >
                <button
                  className={`flex items-center rounded-full justify-center p-2 w-[44px] h-[44px] transition-all duration-200 ${
                    players.length > 1
                      ? "animate-pulse bg-surface shadow-lg"
                      : ""
                  }`}
                >
                  <img
                    src="/play.png"
                    className={`w-6 h-6 object-contain ml-1 contrast-2 drop-shadow-lg brightness-0 transition-all duration-200 ${
                      players.length < 2 ? "brightness-0" : "brightness-100"
                    }`}
                  />
                </button>
                <p className="font-startGame text-2xl text-surface">
                  Start Game
                </p>
              </div>
              <div className="player-count flex justify-between gap-1">
                {handleAvatarRender()}
              </div>
            </div>
            <div className="flex-grow self-end flex-shrink-0">
              <img src="/listening.png" alt="" className="w-32 h-32" />
            </div>
          </div>
        </div>
        {/* SPACER ********************************************************* */}
        <div className="spacer bg-transparent h-1 rounded-full w-full px-4">
          <div className="spacer bg-surfaceLighter h-[2px] rounded-full w-full"></div>
        </div>
        {/* LIST *********************************************************** */}
        <ul className="relative px-4 flex h-full w-full flex-col items-center gap-2 overflow-auto bg-transparent pt-4 pb-4">
          {players.map((player, index) => {
            return (
              <li
                key={player}
                className="flex min-h-8 max-h-12 w-full items-center justify-between overflow-hidden rounded-sm border-[1px] border-secondaryDarker bg-gray-700/30 pl-3 shadow-main"
              >
                <span className="mr-2 text-xs opacity-30">{index + 1}</span>
                <div className="icon flex h-5 w-5 items-center justify-center rounded-full">
                  <FaCheckCircle className="text-secondary" size={15} />
                </div>
                <p
                  className="ml-3 mr-auto bg-transparent text-sm"
                  onChange={handleInputChange}
                >
                  {formatNameFirstLastName(player)}
                </p>
                <button
                  onClick={() => handleRemovePlayer(player)}
                  className="bg-secondary px-3 py-3"
                >
                  <IoIosClose size={20} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {/* INPUT ************************************************************ */}
      <div className="h-16 bg-surfaceLightest w-full flex border-t-2 border-surfaceLighter items-center flex-shrink-0">
        <MdOutlinePersonAddAlt size={20} className="text-surfaceLighter ml-3" />
        <input
          type="text"
          placeholder="Add player"
          className="ml-3 mr-auto bg-transparent font-semibold tracking-wide placeholder:text-primary placeholder:font-normal placeholder:opacity-30 text-primary font-main"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={input}
          minLength={2}
        />
        <button
          onClick={handleAddPlayer}
          className="bg-primary h-full min-w-16 flex items-center justify-center text-black"
        >
          <IoIosAdd size={40} />
        </button>
      </div>
    </div>
  )
}
