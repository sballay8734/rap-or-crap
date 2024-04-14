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
    <article className="w-full bg-[#062b2b] text-white flex justify-between py-2 rounded-sm shadow-main relative border border-[#0c4d4b] flex-grow max-h-[4.5rem] mb-1">
      {/* Avatars */}
      <div className="flex items-center justify-start pl-4 w-full gap-1 border-r border-[#0c4d4b] relative">
        {/* <RxAvatar size={20} /> */}
        <p className="text-xs text-gray-400 font-light relative">{rank}.</p>
        <h2
          className={`text-sm relative ${
            playerName.length <= 8
              ? "text-[0.8rem]"
              : playerName.length <= 10
              ? "text-[0.7rem]"
              : playerName.length <= 12
              ? "text-[0.6rem]"
              : playerName.length <= 15
              ? "text-[0.5rem]"
              : ""
          }`}
        >
          {formatNameFirstLastName(playerName)}
        </h2>
        {rank === 1 ? (
          <img
            className="h-10 w-10 absolute top-1/2 -translate-y-1/2 right-3 z-1 opacity-30"
            src="/first.png"
            alt=""
          />
        ) : rank === 2 ? (
          <img
            className="h-10 w-10 absolute top-1/2 -translate-y-1/2 right-3 z-1 opacity-30"
            src="/second.png"
            alt=""
          />
        ) : rank === 3 ? (
          <img
            className="h-10 w-10 absolute top-1/2 -translate-y-1/2 right-3 z-1 opacity-30"
            src="/third.png"
            alt=""
          />
        ) : null}
      </div>
      {/* Stats */}
      <div className="flex flex-col items-center w-full min-w-[60%] justify-between px-2">
        <div className="statsTop flex items-center w-full justify-between bg-secondary/20 px-2 py-1 rounded-md flex-grow">
          <h2 className="flex items-center gap-1">
            <span className="text-[10px] text-[#c4c4c4]">Correct:</span>
            <span className="text-[10px] text-green-400 font-bold">
              {playerData.cCorrect}
            </span>
          </h2>
          <h2 className="flex gap-1 items-center">
            <span className="text-[10px] text-[#c4c4c4]">Wrong:</span>
            <span className="text-[10px] text-red-400 font-bold">
              {playerData.cWrong}
            </span>
          </h2>
          <h2 className="flex gap-1 items-center min-w-10">
            <span className="text-[10px] text-[#c4c4c4]">Rate:</span>
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
