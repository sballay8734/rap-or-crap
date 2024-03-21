import express from "express"

import { fetchActiveGame, initializeGame } from "../controllers/gameController"
import { authenticateUser } from "../middleware/authenticateUser"

const router = express.Router()

router.post("/initialize-game", authenticateUser, initializeGame)
router.get("/active-game", fetchActiveGame)

export default router
