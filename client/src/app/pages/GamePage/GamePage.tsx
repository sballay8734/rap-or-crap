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

  const [updateGame] = useUpdateGameStateMutation()

  const { players, gameId, promptId, currentLyric } = useFetchActiveGameQuery(
    "skip",
    {
      selectFromResult: ({ data }) => ({
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

  // sort players by best performing
  function sortPlayers() {
    if (!players) return []

    return Object.entries(players).sort(([a, aData], [b, bData]) => {
      const aTotalAnswers = aData.cCorrect + aData.cWrong
      const aPctCorrect =
        aTotalAnswers > 0 ? (aData.cCorrect / aTotalAnswers) * 100 : 0

      const bTotalAnswers = bData.cCorrect + bData.cWrong
      const bPctCorrect =
        bTotalAnswers > 0 ? (bData.cCorrect / bTotalAnswers) * 100 : 0

      return bPctCorrect - aPctCorrect
    })
  }

  const playerData = players && Object.entries(players)

  // only count if player has answered
  const count = Object.values(playerSelections).filter(
    (selection) => selection !== null
  ).length

  // check if submit button should be disabled
  const disabled = playerData && count < playerData.length

  const sortedPlayers = sortPlayers()

  const renderedItems = (
    <>
      <PromptCard playerCount={sortedPlayers.length} answeredCount={count} />
      <article className="answer-select w-full flex flex-col overflow-auto flex-grow justify-start items-center pt-7 pb-1 px-1 gap-1 bg-primaryInactive">
        {sortedPlayers.map(([playerName, playerData]) => {
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
        <div className="flex w-full">
          <button
            className="bg-primaryVariant w-full min-h-16 rounded-sm text-white"
            onClick={handleNavToMainMenu}
          >
            Main Menu
          </button>
          <button
            onClick={() => dispatch(showScoreboard())}
            className="bg-secondary text-black flex items-center justify-center gap-2 absolute bottom-0 right-0 p-[0.7rem] rounded-full mr-3 mb-3 shadow-main"
          >
            <img
              className="h-5 w-5 object-contain"
              src="/scoreboard.png"
              alt=""
            />
          </button>
        </div>
      ) : (
        <div className="flex w-full">
          <button
            onClick={handleSubmission}
            disabled={disabled}
            className={`w-full font-light transition-all border-t border-t-[#49325e] duration-200 ${
              disabled
                ? "bg-primaryInactive text-primary/30 border-t-[#49325e]"
                : "bg-primaryVariant border-t-primaryVariant"
            } min-h-16`}
          >
            {disabled ? `All players must answer` : `Submit Answers`}
          </button>
          <button
            onClick={() => dispatch(showScoreboard())}
            className="bg-secondary text-black flex items-center justify-center gap-2 absolute bottom-0 right-0 p-[0.7rem] rounded-full mr-3 mb-3 shadow-main"
          >
            <img
              className="h-5 w-5 object-contain"
              src="/scoreboard.png"
              alt=""
            />
          </button>
        </div>
      )}
    </>
  )

  return (
    <section className="flex h-svh w-full flex-col items-center justify-between text-white">
      {renderedItems}
    </section>
  )
}
