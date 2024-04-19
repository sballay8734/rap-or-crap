import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"

import dotenv from "dotenv"
dotenv.config()

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "")
  return {
    // vite config
    define: {
      "process.env": env
    },
    plugins: [react()]
  }
})

// REMEMBER: Unfortunately, due to Render limitations, you have to load the env variables under "process.env" from node instead of using VITE_VAR_NAME. You then have to also include the production URL inside of the environment variables on Render also.
