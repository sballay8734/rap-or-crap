import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./app/redux/store";
import { Provider } from "react-redux";

import App from "./app";
import ErrorPage from "./app/pages/ErrorPage";
import LoginPage from "./app/pages/LoginPage";
import SignupPage from "./app/pages/SignupPage";
import "./index.css";
import HomePage from "./app/pages/HomePage";
import GameSetupPage from "./app/pages/GameSetupPage";
import ErrorModal from "./app/components/ErrorModal";

// TODO: ErrorPage will not be hit if there is an error navigating to login, signup, home, etc... I think they need to be nested inside of the root path

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "game-setup",
        element: <GameSetupPage />,
      },
    ],
  },
]);

const el = document.getElementById("root");

if (el) {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
        <ErrorModal />
      </Provider>
    </React.StrictMode>,
  );
} else {
  throw new Error("Could not find root element");
}
