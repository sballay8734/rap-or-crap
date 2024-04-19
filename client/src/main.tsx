// !TODO: Hook up rules modal

/* !TODO: Remove back button on setup page on desktop */

// TODO: Input/signin errors should appear under form

// TODO: ErrorPage will not be hit if there is an error navigating to login, signup, home, etc... I think they need to be nested inside of the root path

/* TODO: Check mouse hover transitions */

/* TODO: Move scoreboard toggle and home nav to top left of GamePage */

/* TODO: Maybe center the leaderboard on desktop? */

// TODO: Still need to clear cache when user selects it

// mTODO: Preload assets

// mTODO: Attribution for icons

// mTODO: maybe move notifications to bottom of screen

import * as React from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { store, persistor } from "./app/redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { Provider } from "react-redux"

import App from "./app"
import ErrorPage from "./app/pages/ErrorPage/ErrorPage"
import SigninPage from "./app/pages/SigninPage/SigninPage"
import SignupPage from "./app/pages/SignupPage/SignupPage"
import GamePage from "./app/pages/GamePage/GamePage"
import HomePage from "./app/pages/HomePage/HomePage"
import GameSetupPage from "./app/pages/GameSetupPage/GameSetupPage"
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "auth",
        children: [
          {
            path: "signin",
            element: <SigninPage />
          },
          {
            path: "signup",
            element: <SignupPage />
          }
        ]
      },
      {
        path: "home",
        element: <HomePage />
      },
      {
        path: "game",
        children: [
          {
            path: "setup",
            element: <GameSetupPage />
          },
          {
            path: "play",
            element: <GamePage />
          }
        ]
      }
    ]
  }
])

const el = document.getElementById("root")

if (el) {
  const root = createRoot(el)
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  )
} else {
  throw new Error("Could not find root element")
}
