// TODO: Player-enter input should be highlighted by default

import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { setResponseMessage } from "../../redux/features/modals/responseModalSlice"
import { IoIosAdd, IoIosClose } from "react-icons/io"
import { FaCheckCircle } from "react-icons/fa"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import {
  IGameInstance,
  useFetchActiveGameQuery,
  useInitializeGameMutation
} from "../../redux/features/game/gameApi"
import { RootState } from "../../redux/store"
import { clearPlayers } from "../../redux/features/game/gameSlice"

const MAX_PLAYERS = 10

export default function GameSetupPage() {
  const [initializeGame] = useInitializeGameMutation()
  // HACK: localGameId is a temporary workaround for poor query structure
  const localGameId = useSelector((state: RootState) => state.game.localGameId)
  const user = useSelector((state: RootState) => state.user.user)

  const userId = useSelector((state: RootState) => state.user.user?._id)
  const { activeGameId, isFetching } = useFetchActiveGameQuery(
    { gameId: localGameId, flag: "skip" },
    {
      selectFromResult: ({ data, isFetching }) => ({
        activeGameId: data?._id,
        isFetching
      }),
      skip: !user
    }
  )

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [players, setPlayers] = useState<string[]>([])
  const [input, setInput] = useState<string>("")

  // REMEMBER: Always call useEffect BEFORE any early returns
  // https://react.dev/warnings/invalid-hook-call-warning

  useEffect(() => {
    if (!activeGameId || isFetching) {
      return
    } else {
      navigate("/home")
    }
  }, [activeGameId, isFetching])

  if (!userId) {
    return (
      <div className="z-1 relative flex h-screen w-full flex-col items-center justify-center gap-8 px-8 py-10 text-white">
        <h1 className="text-4xl text-center">You must be logged in!</h1>
      </div>
    )
  }

  if (isFetching) {
    return (
      <div className="z-1 relative flex h-screen w-full flex-col items-center justify-between gap-8 px-8 py-10 text-white">
        <h1 className="text-4xl">Fetching...</h1>
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
    <div className="z-1 relative flex h-screen w-full flex-col items-center justify-between gap-8 px-8 py-10 text-white">
      <h1 className="text-4xl">Game Setup</h1>
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md">
        <h2 className="flex w-full items-center justify-between bg-yellow-700 px-4 py-2 text-center text-xl">
          <span className="text-xs opacity-50">Total: {players.length}</span>
          Players
          <span className="text-xs opacity-50">Max: {MAX_PLAYERS}</span>
        </h2>
        <ul className="relative flex h-full w-full flex-col items-center gap-3 overflow-auto border-2 border-yellow-900 bg-black/90 p-2">
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
      {/* INPUT CARD */}
      <div className="mt-auto flex min-h-12 min-w-80 items-center justify-between self-center overflow-hidden rounded-md border-[1px] border-green-700 bg-black/90 pl-4">
        <div className="icon h-4 w-4 rounded-full bg-red-500 opacity-50"></div>
        <input
          type="text"
          placeholder="Add player"
          className="ml-3 mr-auto bg-transparent font-light tracking-wider opacity-30"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={input}
          minLength={2}
        />
        <button onClick={handleAddPlayer} className="bg-green-700 px-3 py-3">
          <IoIosAdd size={20} />
        </button>
      </div>
      <button
        className="h-28 w-full"
        style={{
          backgroundImage: "url('start-button.png')",
          backgroundPosition: "center",
          backgroundSize: "200px 200px",
          backgroundRepeat: "no-repeat"
        }}
        onClick={handleStartGame}
      ></button>
    </div>
  )
}
