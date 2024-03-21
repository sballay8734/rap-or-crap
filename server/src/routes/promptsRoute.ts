import express from "express"
import { createPrompt } from "../controllers/promptsController"

const router = express.Router()

router.post("/create-prompt", createPrompt)

export default router
