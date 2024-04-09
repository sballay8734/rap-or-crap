// TODO: Player-enter input should be highlighted by default
// TODO: Start Game text is too dark against surfaceBG

import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { setResponseMessage } from "../../redux/features/modals/responseModalSlice"
import { IoIosAdd, IoIosClose } from "react-icons/io"
import { FaCheckCircle } from "react-icons/fa"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import {
  IGameInstance,
  useInitializeGameMutation
} from "../../redux/features/game/gameApi"
import { RootState } from "../../redux/store"
import { clearPlayers } from "../../redux/features/game/gameSlice"
import { FaArrowLeftLong } from "react-icons/fa6"

const MAX_PLAYERS = 10

export default function GameSetupPage() {
  const [initializeGame] = useInitializeGameMutation()

  const userId = useSelector((state: RootState) => state.user.user?._id)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [players, setPlayers] = useState<string[]>([])
  const [input, setInput] = useState<string>("")

  // REMEMBER: Always call useEffect BEFORE any early returns
  // https://react.dev/warnings/invalid-hook-call-warning

  // useEffect(() => {
  //   if (!activeGameId) {
  //     return
  //   } else {
  //     navigate("/home")
  //   }
  // }, [activeGameId])

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
      setPlayers((prevPlayers) => [...prevPlayers, input.toLocaleLowerCase()])
      setInput("")
    } else {
      dispatch(setResponseMessage({ successResult: false, message: error }))
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
    const filteredPlayers = players.filter((p) => {
      return p !== player
    })
    setPlayers(filteredPlayers)
  }

  function validatePlayer(name: string): string | null {
    if (name.trim().length < 2) {
      return "Player name must be at least 2 characters long."
    }
    if (name.split(" ").length > 2) {
      return "First and last name only."
    }
    if (players.includes(input.toLocaleLowerCase())) {
      return "That player already exists."
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Player name can only contain letters and spaces."
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

  return (
    <div className="z-1 relative flex h-screen w-full flex-col items-center justify-between text-white bg-primaryInactive">
      <div className="header-and-list-wrapper flex flex-col flex-grow w-full bg-surface items-center">
        {/* HEADER ********************************************************* */}
        <div className="bg-transparent py-8 px-6 h-1/3 flex flex-col justify-betweenf flex-shrink-0">
          <div className="flex flex-grow">
            <div className="flex flex-col justify-between flex-grow">
              <Link to="/home" className="flex gap-2 items-center">
                <FaArrowLeftLong size={20} />
              </Link>
              <h2 className="text-2xl">Let's go! Add players to begin.</h2>
              <div className="buttonWrapper flex gap-2 items-center">
                <button className="flex items-center bg-secondary rounded-full justify-center p-2 w-[44px] h-[44px] animate-pulse shadow-lg">
                  <img
                    src="/play.png"
                    className="w-6 h-6 object-contain ml-1 contrast-2 drop-shadow-lg"
                  />
                </button>
                <p className="font-startGame text-2xl text-secondary">
                  Start Game
                </p>
              </div>
            </div>
            <div className="flex-grow self-end flex-shrink-0">
              <img src="/listening.png" alt="" className="w-32 h-32" />
            </div>
          </div>
        </div>
        {/* SPACER ********************************************************* */}
        <div className="spacer bg-surfaceLighter h-1 rounded-full w-[80%] "></div>
        {/* LIST *********************************************************** */}
        <ul className="relative flex h-full w-full flex-col items-center gap-3 overflow-auto bg-transparent mt-8">
          {players.map((player, index) => {
            return (
              <li
                key={player}
                className="flex min-h-12 w-full items-center justify-between overflow-hidden rounded-md border-[1px] border-gray-700 bg-gray-700/30 pl-4"
              >
                <span className="mr-2 text-xs opacity-30">{index + 1}</span>
                <div className="icon flex h-5 w-5 items-center justify-center rounded-full">
                  <FaCheckCircle className="text-green-700" size={15} />
                </div>
                <p
                  className="ml-3 mr-auto bg-transparent"
                  onChange={handleInputChange}
                >
                  {formatNameFirstLastName(player)}
                </p>
                <button
                  onClick={() => handleRemovePlayer(player)}
                  className="bg-red-700 px-3 py-3"
                >
                  <IoIosClose size={20} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {/* INPUT ************************************************************ */}
      <div className="h-16 bg-surfaceLightest w-full flex">
        <input
          type="text"
          placeholder="Add player"
          className="ml-3 mr-auto bg-transparent font-light tracking-wide placeholder:text-secondary placeholder:opacity-30 text-secondary"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={input}
          minLength={2}
        />
        <button
          onClick={handleAddPlayer}
          className="bg-secondary h-full min-w-16 flex items-center justify-center text-black"
        >
          <IoIosAdd size={40} />
        </button>
      </div>

      {/* <h1 className="text-xl py-4 text-black bg-primary w-full text-center">
        Game Setup
      </h1>
      <button
        className="h-20 w-full bg-primaryVariant"
        onClick={handleStartGame}
      >
        START GAME
      </button> */}
      {/* INPUT CARD */}
      {/* <div className="mt-auto flex min-h-12 min-w-[100%] items-center justify-between self-center overflow-hidden bg-black/90">
        <input
          type="text"
          placeholder="Add player"
          className="ml-3 mr-auto bg-transparent font-light tracking-wider opacity-30"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={input}
          minLength={2}
        />
        <button
          onClick={handleAddPlayer}
          className="bg-primary px-3 py-3 h-full"
        >
          <IoIosAdd size={20} />
        </button>
      </div> */}
      {/* <div className="flex h-full w-full flex-col overflow-hidden">
        <h2 className="flex w-full items-center justify-between bg-primary px-4 py-2 text-center text-xl">
          <span className="text-xs opacity-50">Total: {players.length}</span>
          Players
          <span className="text-xs opacity-50">Max: {MAX_PLAYERS}</span>
        </h2>
        <ul className="relative flex h-full w-full flex-col items-center gap-3 overflow-auto p-2">
          {players.map((player, index) => {
            return (
              <li
                key={player}
                className="flex min-h-12 w-full items-center justify-between overflow-hidden rounded-md border-[1px] border-gray-700 bg-gray-700/30 pl-4"
              >
                <span className="mr-2 text-xs opacity-30">{index + 1}</span>
                <div className="icon flex h-5 w-5 items-center justify-center rounded-full">
                  <FaCheckCircle className="text-green-700" size={15} />
                </div>
                <p
                  className="ml-3 mr-auto bg-transparent"
                  onChange={handleInputChange}
                >
                  {formatNameFirstLastName(player)}
                </p>
                <button
                  onClick={() => handleRemovePlayer(player)}
                  className="bg-red-700 px-3 py-3"
                >
                  <IoIosClose size={20} />
                </button>
              </li>
            )
          })}
        </ul>
      </div> */}
    </div>
  )
}
