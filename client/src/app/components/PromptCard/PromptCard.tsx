import { useFetchActiveGameQuery } from "../../redux/features/game/gameApi"
import { FaQuoteLeft } from "react-icons/fa6"
import { FaQuoteRight } from "react-icons/fa6"
import { IoPerson } from "react-icons/io5"
import { IoPersonOutline } from "react-icons/io5"

interface PromptCardProps {
  playerCount: number
  answeredCount: number
}

export default function PromptCard({
  playerCount,
  answeredCount
}: PromptCardProps) {
  const { lyric } = useFetchActiveGameQuery("skip", {
    selectFromResult: ({ data }) => ({
      promptId: data?.currentPromptId,
      lyric: data?.currentLyric
    })
  })

  function renderAvatars() {
    const avatars = []
    for (let i = 0; i < playerCount; i++) {
      if (i < answeredCount) {
        avatars.push(<IoPerson size={20} key={i} className="text-secondary" />)
      } else {
        avatars.push(
          <IoPersonOutline size={20} key={i} className="text-secondary" />
        )
      }
    }

    return avatars
  }

  return (
    <article className="lyric-card flex h-1/5 w-full items-center justify-center bg-[url('/lyricCardBg.jpg')] bg-cover relative z-1">
      <div className="w-full text-center h-full bg-primary/60 flex items-center p-6 flex-col justify-center relative">
        {!lyric ? (
          "Loading..."
        ) : lyric === "No more lyrics" ? (
          "No more lyrics"
        ) : (
          <div className="flex">
            <span className="absolute z-1 top-0 left-0 p-4">
              <FaQuoteLeft
                size={100}
                className="text-primaryInactive opacity-10"
              />
            </span>
            <span className="font-quote text-xl font-semibold relative z-2 text-primaryInactive">
              {lyric}
            </span>
            <span className="absolute z-1 right-0 bottom-0 p-4">
              <FaQuoteRight
                size={100}
                className="text-primaryInactive opacity-10"
              />
            </span>
          </div>
        )}
      </div>
      <div className="absolute w-full h-10 px-4 -bottom-5">
        <div className="w-full h-full bg-primaryInactive rounded-full flex items-center justify-between px-4 shadow-md shadow-[#634687]">
          {renderAvatars()}
        </div>
      </div>
    </article>
  )
}
