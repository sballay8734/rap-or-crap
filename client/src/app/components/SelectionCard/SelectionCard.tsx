// WARNING: memo is doing nothing right now because of the passed function.
// FIXME: Updates to a single card re-render ALL cards (Not good)
import { useState, memo, useEffect } from "react"
import { PlayerStats } from "../../../types/ClientDataTypes"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import { useDispatch, useSelector } from "react-redux"
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
    dispatch(setPlayerAnswer({ playerName, answer: selection }))
  }

  return (
    <article className="w-full bg-surfaceLighter text-white flex justify-between border-b-2 border-primaryInactive">
      <div className="p-2">
        <h2 className="min-w-24">{formatNameFirstLastName(playerName)}</h2>
        <p className="text-[10px] font-light">20 points</p>
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
      <button
        onClick={() => handleAnswerSelect("skip")}
        className={`${
          activeAnswer === "skip"
            ? "bg-slate-700 text-white"
            : "bg-background text-gray-500"
        } p-2 flex-grow`}
      >
        Skip
      </button>
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
