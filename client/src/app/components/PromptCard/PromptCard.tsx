import { useFetchActiveGameQuery } from "../../redux/features/game/gameApi"

export default function PromptCard() {
  const { lyric } = useFetchActiveGameQuery("skip", {
    selectFromResult: ({ data }) => ({
      promptId: data?.currentPromptId,
      lyric: data?.currentLyric
    })
  })

  return (
    <article className="lyric-card flex h-1/5 w-full items-center justify-center rounded-md bg-primaryInactive p-4">
      <p className="w-full text-center text-primary">
        {!lyric
          ? "Loading..."
          : lyric === "No more lyrics"
          ? "No more lyrics"
          : `"${lyric}"`}
      </p>
    </article>
  )
}
