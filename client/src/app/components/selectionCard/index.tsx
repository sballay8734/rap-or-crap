// WARNING: memo is doing nothing right now because of the passed function.
// FIXME: Updates to a single card re-render ALL cards (Not good)
import { useState, memo, useEffect } from "react"
import { PlayerStats } from "../../../types/ClientDataTypes"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import { useDispatch, useSelector } from "react-redux"
import { setPlayerAnswer } from "../../redux/features/game/answersSlice"
import { RootState } from "../../redux/store"

interface SelectionCardProps {
  playerName: string
  playerData: PlayerStats
}

type Selection = "rap" | "crap" | "skip" | null

function SelectionCard({ playerName, playerData }: SelectionCardProps) {
  const dispatch = useDispatch()
  const activeAnswer = useSelector(
    (state: RootState) => state.answers.playerAnswers[playerName]
  )

  function handleAnswerSelect(selection: Selection) {
    dispatch(setPlayerAnswer({ playerName, answer: selection }))
  }

  return (
    <article className="w-full border-slate-900 border-[1px] bg-green-50 text-black flex justify-between">
      <div className="p-2">
        <h2 className="min-w-24">{formatNameFirstLastName(playerName)}</h2>
        <p className="text-[10px] font-light">20 points</p>
      </div>
      <button
        onClick={() => handleAnswerSelect("crap")}
        className={`${
          activeAnswer === "crap"
            ? "bg-red-700 text-white border-2 border-red-500"
            : "bg-red-950 text-gray-400 border-2 border-transparent"
        } p-2 flex-grow`}
      >
        Crap
      </button>
      <button
        onClick={() => handleAnswerSelect("skip")}
        className={`${
          activeAnswer === "skip"
            ? "bg-slate-700 text-white border-2 border-slate-500"
            : "bg-slate-950 text-gray-400 border-2 border-transparent"
        } p-2 flex-grow`}
      >
        Skip
      </button>
      <button
        onClick={() => handleAnswerSelect("rap")}
        className={`${
          activeAnswer === "rap"
            ? "bg-green-700 text-white border-2 border-green-500"
            : "bg-slate-950 text-gray-400 border-2 border-transparent"
        } p-2 flex-grow`}
      >
        Rap
      </button>
    </article>
  )
}

const MemoizedSelectionCard = memo(SelectionCard)

export default MemoizedSelectionCard
