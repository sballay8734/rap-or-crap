import "../../styles/global.css"
import { CounterButton, Link } from "@repo/ui"

// DEPLOYMENT ONLY WORKS IF YOU RUN SERVER LOCALLY
// You'll probably have to deploy server on vercel somehow to

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
      <button
        className="text-green-700 font-bold p-6 m-4 border-2 border-red-400"
        onClick={testServer}
      >
        Test Send Prompt
      </button>
    </div>
  )
}

export default App
