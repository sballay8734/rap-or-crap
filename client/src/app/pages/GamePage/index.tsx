import { useState } from "react"

import {
  useFetchActiveGameQuery,
  useUpdateGameStateMutation
} from "../../redux/GameHandling/gameHandlingApi"
import { logClient } from "../../helpers/logFormatter"
import MemoizedSelectionCard from "../../components/SelectionCard/SelectionCard"
import PromptCard from "../../components/PromptCard/PromptCard"

// ! Add a "view scoreboard" floating button and display the score AND results of the round after each round in a modal with a "next question" button

type Selection = "rap" | "crap" | "skip" | null

export interface PlayerSelections {
  [playerName: string]: Selection
}

export default function GamePage() {
  const [updateGame] = useUpdateGameStateMutation()
  const [playerSelections, setPlayerSelections] = useState<PlayerSelections>({})
  const { players, gameId } = useFetchActiveGameQuery(undefined, {
    selectFromResult: ({ data }) => ({
      players: data?.playersObject,
      gameId: data?._id
    })
  })

  async function handleSubmission() {
    console.log("Submitting...")
    const updatedGame = await updateGame(playerSelections)
    // fetch prompt (on server)
    // compare user responses to correct response
    // update player data
    // send back new playerObject
  }

  function handleSelection(playerName: string, selection: Selection) {
    logClient(playerName, selection)
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

  // ! THIS WORKS! But you don't need it right now
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault()
  //     // Custom logic to handle the refresh
  //     // Display a confirmation message or perform necessary actions
  //   }
  //   window.addEventListener("beforeunload", handleBeforeUnload)
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload)
  //   }
  // }, [])

  return (
    <section className="z-1 relative flex h-svh w-full flex-col items-center justify-center gap-2 p-4 text-white">
      <PromptCard />
      <article className="answer-select w-full flex-1 rounded-md bg-red-900 overflow-auto">
        {playerData &&
          playerData.map(([playerName, playerData]) => {
            // ! Must move card to own component so it can manage it's state
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
    </section>
  )
}
