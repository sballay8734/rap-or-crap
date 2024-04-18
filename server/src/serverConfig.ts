import dotenv from "dotenv"
dotenv.config()
import { json, urlencoded } from "body-parser"
import express, { type Express } from "express"
import morgan from "morgan"
import cors from "cors"
import mongoose from "mongoose"
import { Request, Response, NextFunction } from "express"

import promptsRouter from "./routes/promptsRoute"
import authRouter from "./routes/authRoute"
import gameRouter from "./routes/gameRoute"
import { Err } from "./types/error"
import cookieParser from "cookie-parser"
import { logServer } from "./helpers/logFormatter"
import path from "path"

const uri = process.env.MONGO_URI
const DEPLOYMENT_URL = "https://rap-or-crap.onrender.com"

// Connect to mongodb
async function run() {
  try {
    await mongoose.connect(uri!)
    await mongoose.connection.db.admin().command({ ping: 1 })
    logServer("Pinged your deployment. You successfully connected to MongoDB!")
  } catch (error) {
    logServer(error)
  }
}
run()

// Server Start
export const createServer = (): Express => {
  const app = express()
  app
    .disable("x-powered-by")
    // .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(
      cors({
        credentials: true,
        origin: ["http://localhost:5173", DEPLOYMENT_URL]
      })
    )
    .use(cookieParser())

  app.use("/api/prompts", promptsRouter)
  app.use("/api/auth", authRouter)
  app.use("/api/game", gameRouter)

  const clientDistPath = path.join(__dirname, "../../client/dist")
  app.use("/", express.static(clientDistPath))

  app.use((err: Err, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"

    if (message.length > 50) logServer(`RES MSG IS TOO LONG! MSG: ${message}`)

    return res.status(statusCode).json({
      success: false,
      message
    })
  })

  return app
}

// REMEMBER: Need to serve dist from server in monorepo.
// Build the front-end so that you get a build or dist folder with your react front-end.

// Serve that in your express app, something like app.use('/', express.static('dist')) so that index.html is served and all the js bundle with it.
