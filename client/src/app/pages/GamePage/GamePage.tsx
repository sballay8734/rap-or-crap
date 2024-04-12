import { useDispatch, useSelector } from "react-redux"

import {
  useFetchActiveGameQuery,
  useUpdateGameStateMutation
} from "../../redux/features/game/gameApi"
import { errorClient } from "../../helpers/logFormatter"
import MemoizedSelectionCard from "../../components/SelectionCard/SelectionCard"
import PromptCard from "../../components/PromptCard/PromptCard"
import { clearPlayerAnswers } from "../../redux/features/game/gameSlice"
import { RootState } from "../../redux/store"
import { useNavigate } from "react-router-dom"
import { showScoreboard } from "../../redux/features/modals/scoreboardModalSlice"

export default function GamePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const playerSelections = useSelector(
    (state: RootState) => state.game.playerAnswers
  )
  // HACK: localGameId is a temporary workaround for poor query structure
  const localGameId = useSelector((state: RootState) => state.game.localGameId)

  const [updateGame] = useUpdateGameStateMutation()

  const { players, gameId, promptId, currentLyric } = useFetchActiveGameQuery(
    { gameId: localGameId, flag: "skip" },
    {
      selectFromResult: ({ data, isFetching }) => ({
        players: data?.playersObject,
        gameId: data?._id,
        promptId: data?.currentPromptId,
        currentLyric: data?.currentLyric
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

    dispatch(clearPlayerAnswers())

    await updateGame(submissionObject)
  }

  function handleNavToMainMenu() {
    dispatch(clearPlayerAnswers())
    navigate("/home")
  }

  const playerData = players && Object.entries(players)

  // only count if player has answered
  const count = Object.values(playerSelections).filter(
    (selection) => selection !== null
  ).length

  // check if submit button should be disabled
  const disabled = playerData && count < playerData.length

  const renderedItems = (
    <>
      <PromptCard />
      <article className="answer-select w-full flex flex-col rounded-md bg-background overflow-auto border-0">
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
        <div className="flex w-full gap-2">
          <button
            className="bg-red-950/70 w-full min-h-12 rounded-sm text-red-500"
            onClick={handleNavToMainMenu}
          >
            Main Menu
          </button>
          <button
            onClick={() => dispatch(showScoreboard())}
            className="px-4 py-1 bg-green-300 rounded-sm"
          >
            <img
              className="h-12 w-12 object-contain"
              src="/scoreboard.png"
              alt=""
            />
          </button>
        </div>
      ) : (
        <div className="flex w-full gap-2">
          <button
            onClick={handleSubmission}
            disabled={disabled}
            className={`w-full ${
              disabled
                ? "bg-primaryInactive text-gray-400"
                : "bg-primaryVariant"
            } min-h-12 rounded-sm`}
          >
            {disabled
              ? `All players must answer (${count}/${playerData.length})`
              : `Submit Answers`}
          </button>
          <button
            onClick={() => dispatch(showScoreboard())}
            className="px-4 py-1 bg-transparent rounded-sm border border-primary text-primary"
          >
            Score
            {/* <img
              className="h-12 w-12 object-contain"
              src="/scoreboard.png"
              alt=""
            /> */}
          </button>
        </div>
      )}
    </>
  )

  return (
    <section className="z-1 relative flex h-svh w-full flex-col items-center justify-between gap-2 p-4 text-white">
      {renderedItems}
    </section>
  )
}
