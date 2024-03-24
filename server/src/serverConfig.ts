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
import logServer from "./helpers/logFormatter"

const uri = process.env.MONGO_URI

logServer(
  true,
  "Hello",
  null,
  undefined,
  { name: "Shawn", age: 21 },
  true,
  false,
  389,
  93n,
  ["Dave", "Steve", 398, true]
)

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
    .use(cors({ credentials: true, origin: "http://localhost:5173" }))
    .use(cookieParser())

  app.use("/api/prompts", promptsRouter)
  app.use("/api/auth", authRouter)
  app.use("/api/game", gameRouter)

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
