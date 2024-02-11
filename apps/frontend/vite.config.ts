// vite.config.js in apps/frontend
import react from "@vitejs/plugin-react"
import path from "path"

export default {
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@fs",
        replacement: path.resolve(__dirname, "../../packages/ui/dist")
      }
    ]
  }
}
