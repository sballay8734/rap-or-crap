import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import promptsRouter from "./routes/promptsRoute";
import authRouter from "./routes/authRoute";
import gameRouter from "./routes/gameRoute";
import { Err } from "./types/error";

// TODO: set up dotenv for connection string and other things
const uri =
  "mongodb+srv://shawnballay1:UlQOgDRFZ3vB2sRc@cluster0.lseriug.mongodb.net/?retryWrites=true&w=majority";

// Connect to mongodb
async function run() {
  try {
    await mongoose.connect(uri);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.log(error);
  }
}
run();

// Server Start
export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors());

  app.use("/api/prompts", promptsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/game", gameRouter);

  app.use((err: Err, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

  return app;
};
