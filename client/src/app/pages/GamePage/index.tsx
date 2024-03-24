import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import { logClient } from "../../helpers/logFormatter"
import { useFetchActiveGameQuery } from "../../redux/GameHandling/gameHandlingApi"

// ! Add a "view scoreboard" floating button and display the score AND results of the round after each round in a modal with a "next question" button

export default function GamePage() {
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

  const { players } = useFetchActiveGameQuery(undefined, {
    selectFromResult: ({ data }) => ({
      players: data?.playersObject
    })
  })

  async function handleSubmission() {
    console.log("Submitting...")
  }

  const playerNames = players && Object.keys(players)

  logClient(playerNames)

  if (!playerNames || playerNames.length < 1) {
    return (
      <div className="z-1 relative flex h-svh w-full flex-col items-center justify-center gap-2 p-4 text-white">
        Something is wrong
      </div>
    )
  }

  const tempDisabled = true
  const tempCrapActive = false
  const tempSkipActive = false
  const tempRapActive = true

  return (
    <section className="z-1 relative flex h-svh w-full flex-col items-center justify-center gap-2 p-4 text-white">
      <article className="lyric-card flex h-1/5 w-full items-center justify-center rounded-md bg-white">
        <p className="w-full text-center text-black">
          "I fuck all the colors. Call me the rainbow fucker."
        </p>
      </article>
      <article className="answer-select w-full flex-1 rounded-md bg-red-900 overflow-auto">
        {playerNames &&
          playerNames.map((player) => {
            // ! Must move card to own component so it can manage it's state
            return (
              <div
                key={player}
                className="w-full border-slate-900 border-[1px] bg-green-50 text-black flex justify-between"
              >
                <div className="p-2">
                  <h2 className="min-w-24">
                    {formatNameFirstLastName(player)}
                  </h2>
                  <p className="text-[10px] font-light">20 points</p>
                </div>
                <button
                  className={`${
                    tempCrapActive
                      ? "bg-red-700 text-white border-2 border-red-500"
                      : "bg-red-950 text-gray-400 border-2 border-transparent"
                  } p-2 flex-grow`}
                >
                  Crap
                </button>
                <button
                  className={`${
                    tempRapActive
                      ? "bg-slate-700 text-white border-2 border-slate-500"
                      : "bg-slate-950 text-gray-400 border-2 border-transparent"
                  } p-2 flex-grow`}
                >
                  Skip
                </button>
                <button
                  className={`${
                    tempSkipActive
                      ? "bg-green-700 text-white border-2 border-green-500"
                      : "bg-slate-950 text-gray-400 border-2 border-transparent"
                  } p-2 flex-grow`}
                >
                  Rap
                </button>
              </div>
            )
          })}
      </article>
      <button
        onClick={handleSubmission}
        disabled={tempDisabled}
        className={`w-full ${
          tempDisabled ? "bg-slate-800 text-gray-500" : "bg-green-500"
        } min-h-12 rounded-sm`}
      >
        {tempDisabled ? "All players must answer" : "Submit Answers"}
      </button>
    </section>
  )
}
