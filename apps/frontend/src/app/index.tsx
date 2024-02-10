import "../../styles/global.css"
import { CounterButton, Link } from "@repo/ui"

function App(): JSX.Element {
  const testObject = {
    artistName: "Bob Dillon",
    lyric: "Oh baby baby what are you doing and where did you go?",
    youtubeUrl: "string"
  }

  async function testServer() {
    const res = await fetch("http://localhost:5001/api/prompts/create-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testObject)
    })

    if (!res.ok) return // throw error

    const data = await res.json()

    console.log(data)
  }

  return (
    <div className="container">
      <h1 className="title">
        Admin <br />
        <span>Kitchen Sink</span>
      </h1>
      <CounterButton />
      <p className="description">
        Built With{" "}
        <Link href="https://turbo.build/repo" newTab>
          Turborepo
        </Link>
        {" & "}
        <Link href="https://vitejs.dev/" newTab>
          Vite
        </Link>
      </p>
      <button
        className="text-purple-700 font-bold p-6 m-4"
        onClick={testServer}
      >
        Test Send Prompt
      </button>
    </div>
  )
}

export default App
