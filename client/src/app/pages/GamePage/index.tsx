import { useDispatch, useSelector } from "react-redux"

import {
  useFetchActiveGameQuery,
  useUpdateGameStateMutation
} from "../../redux/features/game/gameApi"
import { errorClient, logClient } from "../../helpers/logFormatter"
import MemoizedSelectionCard from "../../components/selectionCard"
import PromptCard from "../../components/promptCard"
import { clearPlayerAnswers } from "../../redux/features/game/gameSlice"
import { RootState } from "../../redux/store"
import { useNavigate } from "react-router-dom"

// TODO: Add a "view scoreboard" floating button and display the score AND results of the round after each round in a modal with a "next question" button

type Selection = "rap" | "crap" | "skip" | null

export interface PlayerSelections {
  [playerName: string]: Selection
}

export default function GamePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const playerSelections = useSelector(
    (state: RootState) => state.game.playerAnswers
  )
  // HACK: localGameId is a temporary workaround for poor query structure
  const localGameId = useSelector((state: RootState) => state.game.localGameId)

  const [updateGame, { isLoading }] = useUpdateGameStateMutation()
  const { players, gameId, promptId, currentLyric } = useFetchActiveGameQuery(
    localGameId,
    {
      selectFromResult: ({ data }) => ({
        players: data?.playersObject,
        gameId: data?._id,
        promptId: data?.currentPromptId,
        currentLyric: data?.currentLyric,
        isLoading: isLoading
      })
    }
  )

  async function handleSubmission() {
    if (!gameId || !promptId) {
      errorClient("Missing gameId or promptId")
      return
    }

    const submissionObject = {
      answersObject: playerSelections,
      gameId: gameId,
      promptId: promptId
    }

    console.log(submissionObject)

    dispatch(clearPlayerAnswers())

    await updateGame(submissionObject)
  }

  function handleNavToMainMenu() {
    dispatch(clearPlayerAnswers())
    navigate("/home")
  }

  const playerData = players && Object.entries(players)

  if (!playerData || playerData.length < 1) {
    return (
      <div className="z-1 relative flex h-svh w-full flex-col items-center justify-center gap-2 p-4 text-white">
        Something is wrong
      </div>
    )
  }

  // only count if player has answered
  const count = Object.values(playerSelections).filter(
    (selection) => selection !== null
  ).length

  // check if submit button should be disabled
  const disabled = count < playerData.length

  const renderedItems = (
    <>
      <PromptCard />
      <article className="answer-select w-full flex-1 rounded-md bg-red-900 overflow-auto">
        {playerData &&
          playerData.map(([playerName, playerData]) => {
            return (
              <MemoizedSelectionCard
                key={playerName}
                playerName={playerName}
                playerData={playerData}
              />
            )
          })}
      </article>

      {currentLyric === "No more lyrics" ? (
        <button
          className="bg-red-950/70 w-full min-h-12 rounded-sm text-red-500"
          onClick={handleNavToMainMenu}
        >
          Main Menu
        </button>
      ) : (
        <button
          onClick={handleSubmission}
          disabled={disabled}
          className={`w-full ${
            disabled ? "bg-slate-800 text-gray-500" : "bg-green-500"
          } min-h-12 rounded-sm`}
        >
          {disabled
            ? `All players must answer (${count}/${playerData.length})`
            : `Submit Answers ${count}`}
        </button>
      )}
    </>
  )

  return (
    <section className="z-1 relative flex h-svh w-full flex-col items-center justify-center gap-2 p-4 text-white">
      {renderedItems}
    </section>
  )
}
