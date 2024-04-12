// WARNING: memo is doing nothing right now because of the passed function.
// FIXME: Updates to a single card re-render ALL cards (Not good)
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PlayerStats } from "../../../types/ClientDataTypes"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import { setPlayerAnswer } from "../../redux/features/game/gameSlice"
import { RootState } from "../../redux/store"
import { Circle } from "rc-progress"

interface SelectionCardProps {
  playerName: string
  playerData: PlayerStats
}

type Selection = "rap" | "crap" | "skip" | null

function SelectionCard({ playerName, playerData }: SelectionCardProps) {
  const dispatch = useDispatch()
  const activeAnswer = useSelector(
    (state: RootState) => state.game.playerAnswers[playerName]
  )

  function handleAnswerSelect(selection: Selection) {
    dispatch(setPlayerAnswer({ playerName, answer: selection }))
  }

  const colorMap = {
    veryBad: { line: "#ff0000", text: "text-[#ff0000]" },
    bad: { line: "#ff5959", text: "text-[#ff5959]" },
    okay: { line: "#ff9100", text: "text-[#ff9100]" },
    good: { line: "#ffff6b", text: "text-[#ffff6b]" },
    veryGood: { line: "#9cff9c", text: "text-[#9cff9c]" },
    great: { line: "#00ff00", text: "text-[#00ff00]" },
    youreCheating: { line: "#5c85ff", text: "text-[#5c85ff]" }
  }

  function handleColor(pct: number) {
    if (pct < 10) {
      return colorMap.veryBad
    } else if (pct < 25) {
      return colorMap.bad
    } else if (pct < 40) {
      return colorMap.okay
    } else if (pct < 60) {
      return colorMap.good
    } else if (pct < 75) {
      return colorMap.veryGood
    } else if (pct < 100) {
      return colorMap.great
    } else {
      return colorMap.youreCheating
    }
  }

  const playerRight = playerData.cCorrect
  const playerWrong = playerData.cWrong

  const playerPctRight = (playerRight / (playerRight + playerWrong)) * 100 || 0

  return (
    <article className="w-full bg-surface text-white flex justify-between border-b-2 border-primary flex-grow max-h-16 rounded-sm shadow-main">
      <div className="py-2 px-4 flex items-center w-[45%] justify-between">
        <h2 className="min-w-24">{formatNameFirstLastName(playerName)}</h2>
        <div
          className={`w-10 h-10 bg-[#171717] rounded-full relative flex items-center justify-center shadow-main`}
        >
          <Circle
            percent={playerPctRight}
            strokeWidth={8}
            strokeColor={`${handleColor(playerPctRight).line}`}
            trailColor="#303030"
            trailWidth={8}
          />
          <p
            className={`absolute ${
              handleColor(playerPctRight).text
            } text-[8px]`}
          >
            {playerPctRight.toFixed(1)}%
          </p>
        </div>
      </div>
      <button
        onClick={() => handleAnswerSelect("crap")}
        className={`${
          activeAnswer === "crap"
            ? "bg-primary text-black"
            : "bg-primaryInactive text-gray-500"
        } p-2 flex-grow`}
      >
        Crap
      </button>
      {/* <button
        onClick={() => handleAnswerSelect("skip")}
        className={`${
          activeAnswer === "skip"
            ? "bg-slate-700 text-white"
            : "bg-background text-gray-500"
        } p-2 flex-grow`}
      >
        Skip
      </button> */}
      <button
        onClick={() => handleAnswerSelect("rap")}
        className={`${
          activeAnswer === "rap"
            ? "bg-secondary text-black"
            : "bg-secondaryInactive text-gray-500"
        } p-2 flex-grow`}
      >
        Rap
      </button>
    </article>
  )
}

const MemoizedSelectionCard = memo(SelectionCard)

export default MemoizedSelectionCard
