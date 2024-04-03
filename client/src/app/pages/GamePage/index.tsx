import { useState } from "react"

import {
  useFetchActiveGameQuery,
  useUpdateGameStateMutation
} from "../../redux/features/game/gameApi"
import { errorClient, logClient } from "../../helpers/logFormatter"
import MemoizedSelectionCard from "../../components/selectionCard"
import PromptCard from "../../components/promptCard"

// TODO: Add a "view scoreboard" floating button and display the score AND results of the round after each round in a modal with a "next question" button

type Selection = "rap" | "crap" | "skip" | null

export interface PlayerSelections {
  [playerName: string]: Selection
}

// TODO: Clear answers when Next Lyric is clicked in modal. Might need to reconsider local state organization in the Selection Card

export default function GamePage() {
  // FIXME: wrong "isLoading" - throttle connection to find what is rendering, where it's rendering, and when.
  const [updateGame, { isLoading }] = useUpdateGameStateMutation()
  const [playerSelections, setPlayerSelections] = useState<PlayerSelections>({})
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

    await updateGame(submissionObject)
  }

  function handleSelection(playerName: string, selection: Selection) {
    setPlayerSelections((prevSelections) => ({
      ...prevSelections,
      [playerName]: selection
    }))
  }

  const playerData = players && Object.entries(players)

  if (!playerData || playerData.length < 1) {
    return (
      <div className="z-1 relative flex h-svh w-full flex-col items-center justify-center gap-2 p-4 text-white">
        Something is wrong
      </div>
    )
  }

  const count = Object.keys(playerSelections).length
  const disabled = Object.keys(playerSelections).length < playerData.length

  // Render this when loading is complete
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
                handleSelection={handleSelection}
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
