// TODO: memo is doing nothing right now because of the passed function.
// TODO: Updates to a single card re-render ALL cards (Not good)
import { useState, memo } from "react"
import { PlayerStats } from "../../../types/ClientDataTypes"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"

interface SelectionCardProps {
  playerName: string
  handleSelection: (playerName: string, selection: Selection) => void
  playerData: PlayerStats
}

type Selection = "rap" | "crap" | "skip" | null

function SelectionCard({
  playerName,
  handleSelection,
  playerData
}: SelectionCardProps) {
  const [activeBtn, setActiveBtn] = useState<Selection | null>(null)

  function handleAnswerSelect(selection: Selection) {
    setActiveBtn(selection)
    handleSelection(playerName, selection)
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
          activeBtn === "crap"
            ? "bg-red-700 text-white border-2 border-red-500"
            : "bg-red-950 text-gray-400 border-2 border-transparent"
        } p-2 flex-grow`}
      >
        Crap
      </button>
      <button
        onClick={() => handleAnswerSelect("skip")}
        className={`${
          activeBtn === "skip"
            ? "bg-slate-700 text-white border-2 border-slate-500"
            : "bg-slate-950 text-gray-400 border-2 border-transparent"
        } p-2 flex-grow`}
      >
        Skip
      </button>
      <button
        onClick={() => handleAnswerSelect("rap")}
        className={`${
          activeBtn === "rap"
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
