import { useFetchActiveGameQuery } from "../../redux/GameHandling/gameHandlingApi"

export default function PromptCard() {
  const { promptId, lyric } = useFetchActiveGameQuery(undefined, {
    selectFromResult: ({ data }) => ({
      promptId: data?.promptId,
      lyric: data?.currentLyric
    })
  })

  return (
    <article className="lyric-card flex h-1/5 w-full items-center justify-center rounded-md bg-white p-4">
      <p className="w-full text-center text-black">"{lyric}"</p>
    </article>
  )
}
