export default function GamePage() {
  return (
    <section className="z-1 relative flex h-svh w-full flex-col items-center justify-center gap-2 p-4 text-white">
      <article className="lyric-card flex h-1/4 w-full items-center justify-center rounded-md bg-white">
        <p className="w-full text-center text-black">
          "I fuck all the colors. Call me the rainbow fucker."
        </p>
      </article>
      <article className="answer-select w-full flex-1 rounded-md bg-red-500"></article>
      <button>Submit Answers</button>
    </section>
  );
}
