import { useDispatch } from "react-redux"

import { PlayerStats } from "../../../types/ClientDataTypes"
import { formatNameFirstLastName } from "../../helpers/formattingStrings"
import { RxAvatar } from "react-icons/rx"
import { FaCircle } from "react-icons/fa6"
import { FaRegCircle } from "react-icons/fa"

interface ScoreboardCardProps {
  playerName: string
  playerData: PlayerStats
  rank: number
}

function ScoreboardCard({ playerName, playerData, rank }: ScoreboardCardProps) {
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

  return (
    <article className="w-full bg-surface text-white flex justify-between py-2 rounded-sm shadow-main relative border border-[#292929] flex-grow">
      {/* Avatars */}
      <div className="flex items-center justify-start pl-4 w-40 gap-1 border-r border-secondaryDarker">
        {/* <RxAvatar size={20} /> */}
        <p className="text-sm text-gray-400">{rank}.</p>
        <h2 className="text-sm">{formatNameFirstLastName(playerName)}</h2>
      </div>
      {/* Stats */}
      <div className="flex flex-col items-center w-full justify-between px-2">
        <div className="statsTop flex items-center w-full justify-between bg-gray-800 px-2 py-1 rounded-md flex-grow">
          <h2 className="flex items-center gap-1">
            <span className="text-[10px] text-[#9d9d9d]">Correct:</span>
            <span className="text-[10px] text-green-400 font-bold">
              {playerData.cCorrect}
            </span>
          </h2>
          <h2 className="flex gap-1 items-center">
            <span className="text-[10px] text-[#9d9d9d]">Wrong:</span>
            <span className="text-[10px] text-red-400 font-bold">
              {playerData.cWrong}
            </span>
          </h2>
          <h2 className="flex gap-1 items-center min-w-10">
            <span className="text-[10px] text-[#9d9d9d]">Rate:</span>
            <span className={`text-[10px] ${handleColor(pctCorrect).text}`}>
              {Number(pctCorrect).toFixed(1)}%
            </span>
          </h2>
        </div>
        <div className="tracker px-1 flex gap-1 w-full items-center pt-2">
          <FaRegCircle
            className="bg-green-500 text-green-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-red-500 text-red-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-green-500 text-green-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-green-500 text-green-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-green-500 text-green-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-green-500 text-green-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-red-500 text-red-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-red-500 text-red-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-green-500 text-green-500 rounded-full"
            size={8}
          />
          <FaRegCircle
            className="bg-red-500 text-red-500 rounded-full"
            size={8}
          />
        </div>
      </div>
    </article>
  )
}

export default ScoreboardCard
