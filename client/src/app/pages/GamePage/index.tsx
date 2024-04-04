import { useDispatch, useSelector } from "react-redux"

import {
  useFetchActiveGameQuery,
  useUpdateGameStateMutation
} from "../../redux/features/game/gameApi"
import { errorClient, logClient } from "../../helpers/logFormatter"
import MemoizedSelectionCard from "../../components/selectionCard"
import PromptCard from "../../components/promptCard"
import { clearPlayerAnswers } from "../../redux/features/game/answersSlice"
import { RootState } from "../../redux/store"

// TODO: Add a "view scoreboard" floating button and display the score AND results of the round after each round in a modal with a "next question" button

type Selection = "rap" | "crap" | "skip" | null

export interface PlayerSelections {
  [playerName: string]: Selection
}

export default function GamePage() {
  const dispatch = useDispatch()
  const playerSelections = useSelector(
    (state: RootState) => state.answers.playerAnswers
  )
  const [updateGame, { isLoading, isSuccess }] = useUpdateGameStateMutation()
  const { players, gameId, promptId } = useFetchActiveGameQuery(undefined, {
    selectFromResult: ({ data }) => ({
      players: data?.playersObject,
      gameId: data?._id,
      promptId: data?.currentPromptId,
      isLoading: isLoading
    })
  })

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

    dispatch(clearPlayerAnswers())

    await updateGame(submissionObject)
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
    </>
  )

  return (
    <section className="z-1 relative flex h-svh w-full flex-col items-center justify-center gap-2 p-4 text-white">
      {renderedItems}
    </section>
  )
}
