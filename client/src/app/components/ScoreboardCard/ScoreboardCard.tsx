import { useDispatch } from "react-redux"

import { PlayerStats } from "../../../types/ClientDataTypes"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import { RxAvatar } from "react-icons/rx"

interface ScoreboardCardProps {
  playerName: string
  playerData: PlayerStats
}

function ScoreboardCard({ playerName, playerData }: ScoreboardCardProps) {
  const dispatch = useDispatch()

  // If no answers yet, return 0 to avoid NaN (divide by 0) error
  const pctCorrect =
    playerData.cCorrect + playerData.cWrong === 0
      ? 0
      : (
          (playerData.cCorrect / (playerData.cCorrect + playerData.cWrong)) *
          100
        )
          .toFixed(2)
          .toString()

  const currentStreak =
    playerData.cCorrectStreak > 0
      ? { type: "correct", streak: playerData.cCorrectStreak }
      : { type: "wrong", streak: playerData.cWrongStreak }

  return (
    <article className="w-full border-slate-900 border-[1px] bg-green-50 text-black flex justify-between">
      {/* Avatars */}
      <div className="py-2 flex flex-col items-center justify-center w-20 bg-gray-500">
        <RxAvatar size={20} />
        <h2 className="text-xs">{formatNameFirstLastName(playerName)}</h2>
      </div>
      {/* Stats */}
      <div className="flex items-center w-full justify-between px-4">
        <h2 className="flex flex-col items-center">
          <span className="text-xs">Correct</span>
          <span className="text-xs text-green-600 font-bold">
            {playerData.cCorrect}
          </span>
        </h2>
        <h2 className="flex flex-col items-center">
          <span className="text-xs">Wrong</span>
          <span className="text-xs text-red-600 font-bold">
            {playerData.cWrong}
          </span>
        </h2>
        <h2 className="flex flex-col items-center">
          <span className="text-xs">Streak</span>
          <span
            className={`text-xs font-bold ${
              currentStreak.type === "correct"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {currentStreak.streak}
          </span>
        </h2>
        <h2 className="flex flex-col items-center min-w-10">
          <span className="text-xs">{pctCorrect}%</span>
        </h2>
      </div>
    </article>
  )
}

export default ScoreboardCard
