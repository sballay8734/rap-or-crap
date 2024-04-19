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
      <div className="bg-primary/60 w-full h-full flex items-center justify-center">
        <div className="w-full text-center h-full bg-primary/40 flex items-center p-6 flex-col justify-center relative max-w-[700px]">
          {!lyric ? (
            "Loading..."
          ) : lyric === "No more lyrics" ? (
            <span className="text-primaryInactive">No more lyrics</span>
          ) : (
            <div className="flex">
              <span className="absolute z-1 top-0 left-0 p-4">
                <FaQuoteLeft className="text-primaryInactive opacity-30 h-[6rem] w-[6rem]" />
              </span>
              <span className="font-quote text-lg font-semibold relative z-2 text-primaryInactive max-w-[400px]">
                {lyric}
              </span>
              <span className="absolute z-1 right-0 bottom-0 p-4">
                <FaQuoteRight className="text-primaryInactive opacity-30 h-[6rem] w-[6rem]" />
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute h-10 px-4 -bottom-5 flex justify-center">
        <div className="w-full h-full bg-primaryInactive rounded-full flex items-center justify-center gap-4 px-5 shadow-sm shadow-[#634687] max-w-[93%]">
          {renderAvatars()}
        </div>
      </div>
    </article>
  )
}
