import { useSelector } from "react-redux"
import { useFetchActiveGameQuery } from "../../redux/features/game/gameApi"
import { RootState } from "../../redux/store"

export default function PromptCard() {
  // HACK: localGameId is a temporary workaround for poor query structure
  const localGameId = useSelector((state: RootState) => state.game.localGameId)
  const user = useSelector((state: RootState) => state.user.user)

  const { promptId, lyric } = useFetchActiveGameQuery(
    { gameId: localGameId, flag: "skip" },
    {
      selectFromResult: ({ data }) => ({
        promptId: data?.currentPromptId,
        lyric: data?.currentLyric
      }),
      skip: !user
    }
  )

  return (
    <article className="lyric-card flex h-1/5 w-full items-center justify-center rounded-md bg-white p-4">
      <p className="w-full text-center text-black">
        {lyric === "No more lyrics" ? "No more lyrics" : `"${lyric}"`}
      </p>
    </article>
  )
}
