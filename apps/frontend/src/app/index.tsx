import "../../styles/global.css";
import LoginPage from "./pages/LoginPage";

function App(): JSX.Element {
  const testObject = {
    artistName: "Bob Dillon",
    lyric: "Oh baby baby what are you doing and where did you go?",
    youtubeUrl: "string",
  };

  const testUserLoggedIn = false;

  async function testServer() {
    const res = await fetch("http://localhost:5001/api/prompts/create-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testObject),
    });

    if (!res.ok) return; // throw error

    const data = await res.json();

    console.log(data);
  }

  // show LoginPage if there is no user logged in
  if (!testUserLoggedIn) return <LoginPage />;

  return (
    <div className="container flex h-full w-full items-center justify-center">
      <button
        className="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3"
        onClick={testServer}
      >
        Test Send Prompt
      </button>
    </div>
  );
}

export default App;
