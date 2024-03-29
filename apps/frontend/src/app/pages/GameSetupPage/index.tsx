import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setResponseMessage } from "../../redux/serverResponseSlice";
import { IoIosAdd, IoIosClose } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { formatNameFirstLastName } from "../../helpers/formattingStrings";
import { showConfirmModal } from "../../redux/ConfirmModalSlice";
import {
  IGameInstance,
  useInitializeGameMutation,
} from "../../redux/GameHandling/gameHandlingApi";

const MAX_PLAYERS = 10;
// TODO: Set up auth routes and login behavior
const tempUserId = "asdlkjf2398u298ugasd";

export default function GameSetupPage() {
  const [initializeGame, { isError, isLoading, isSuccess }] =
    useInitializeGameMutation();

  const navigate = useNavigate();
  // TODO: Ask if it's better to declare dispatch outside component
  const dispatch = useDispatch();
  const [players, setPlayers] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  function handleAddPlayer() {
    const error = validatePlayer(input);

    // store all names as lowercase for easier comparison (format name in jsx)
    if (!error) {
      setPlayers((prevPlayers) => [...prevPlayers, input.toLocaleLowerCase()]);
      setInput("");
    } else {
      dispatch(setResponseMessage({ successResult: false, message: error }));
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      handleAddPlayer();
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleRemovePlayer(player: string) {
    const filteredPlayers = players.filter((p) => {
      return p !== player;
    });
    setPlayers(filteredPlayers);
  }

  function validatePlayer(name: string): string | null {
    if (name.trim().length < 2) {
      return "Player name must be at least 2 characters long.";
    }
    if (name.split(" ").length > 2) {
      return "First and last name only.";
    }
    if (players.includes(input.toLocaleLowerCase())) {
      return "That player already exists.";
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Player name can only contain letters and spaces.";
    }
    if (players.length >= MAX_PLAYERS) {
      return "Maximum number of players reached.";
    }
    return null;
  }

  async function handleStartGame() {
    if (players.length < 1) {
      dispatch(
        setResponseMessage({
          successResult: false,
          message: "At least one player is required.",
        }),
      );
      return;
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
        },
      ]),
    );

    const fullGameObject: IGameInstance = {
      playersObject: { ...playersObject },
      userId: tempUserId,
      gameStartDate: new Date().toISOString(),
    };

    // Errors are handled in createApi so no real need for them here
    try {
      const newGame = await initializeGame(fullGameObject);
      if ("data" in newGame) {
        // TODO: Clear previous game
        navigate("/game");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
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
            );
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
          backgroundRepeat: "no-repeat",
        }}
        onClick={handleStartGame}
      ></button>
    </div>
  );
}
