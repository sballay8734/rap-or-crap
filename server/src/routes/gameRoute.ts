import express from "express"

import {
  deleteOldActiveGame,
  fetchActiveGame,
  getNewPrompt,
  initializeGame,
  updateGame
} from "../controllers/gameController"
import { authenticateUser } from "../middleware/authenticateUser"

const router = express.Router()

router.post("/initialize-game", authenticateUser, initializeGame)

// TODO: Also, look into "fetchActiveGame" sometimes appearing inside modals to render and not being removed (hard to replicate but keep and eye on it)

router.get("/active-game", authenticateUser, fetchActiveGame)
router.delete("/delete-game", authenticateUser, deleteOldActiveGame)
router.patch("/update-game", authenticateUser, updateGame)
router.patch("/get-new-prompt/:gameId", authenticateUser, getNewPrompt)

export default router
