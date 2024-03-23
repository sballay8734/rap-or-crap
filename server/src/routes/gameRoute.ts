import express from "express"

import {
  deleteOldActiveGame,
  fetchActiveGame,
  initializeGame
} from "../controllers/gameController"
import { authenticateUser } from "../middleware/authenticateUser"

const router = express.Router()

router.post("/initialize-game", authenticateUser, initializeGame)
router.get("/active-game", authenticateUser, fetchActiveGame)
router.delete("/delete-game", authenticateUser, deleteOldActiveGame)

export default router
