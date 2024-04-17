// WARNING: memo is doing nothing right now because of the passed function.
// OPTIMIZE: Updates to a single card re-render ALL cards (Not good)
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PlayerStats } from "../../../types/ClientDataTypes"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import { setPlayerAnswer } from "../../redux/features/game/gameSlice"
import { RootState } from "../../redux/store"

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
    if (activeAnswer === selection) {
      dispatch(setPlayerAnswer({ playerName, answer: null }))
    } else {
      dispatch(setPlayerAnswer({ playerName, answer: selection }))
    }
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
    <article
      className={`w-full bg-[#281938] text-white flex justify-between flex-grow max-h-[4.5rem] shadow-main overflow-hidden border border-[#49325e] rounded-sm transition-all duration-300`}
    >
      {/* NAME AND ACC */}
      <div className="py-2 px-4 flex items-center w-[45%] justify-between relative">
        <h2
          className={`text-sm relative min-w-28 flex flex-col leading-5 ${
            playerName.length <= 8
              ? "text-[1rem]"
              : playerName.length <= 10
              ? "text-[0.9rem]"
              : playerName.length <= 12
              ? "text-[0.8rem]"
              : playerName.length <= 15
              ? "text-[0.7rem]"
              : ""
          }`}
        >
          {formatNameFirstLastName(playerName)}
          <span className="text-[#704b99] text-[0.6rem] gap-1">
            Accuracy:
            <span
              className={`${
                handleColor(playerPctRight).text
              } bg-[#1f132c] rounded-sm px-1 py-1 ml-1`}
            >
              {playerPctRight.toFixed(1)}%
            </span>
          </span>
        </h2>
      </div>
      {/* BUTTONS */}
      <div className="buttons w-[55%] h-full flex items-center">
        <button
          onClick={() => handleAnswerSelect("crap")}
          className={`${
            activeAnswer === "crap"
              ? "bg-primary text-black"
              : "bg-black/20 text-primary/20"
          } p-2 flex-grow h-full w-1/2`}
        >
          Crap
        </button>
        <div className="divider w-[1px] bg-black/20 h-full flex items-center justify-center">
          <div className="h-3/5 bg-primary/20 w-[1px] rounded-full"></div>
        </div>
        <button
          onClick={() => handleAnswerSelect("rap")}
          className={`${
            activeAnswer === "rap"
              ? "bg-secondary text-black"
              : "bg-black/20 text-primary/20"
          } p-2 flex-grow h-full w-1/2`}
        >
          Rap
        </button>
      </div>
    </article>
  )
}

const MemoizedSelectionCard = memo(SelectionCard)

export default MemoizedSelectionCard
