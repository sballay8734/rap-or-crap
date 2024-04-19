import express from "express"

import {
  // clearSeenIds,
  deleteOldActiveGame,
  fetchActiveGame,
  getNewPrompt,
  initializeGame,
  updateGame
} from "../controllers/gameController"
import { authenticateUser } from "../middleware/authenticateUser"

const router = express.Router()

router.post("/initialize-game", authenticateUser, initializeGame)
router.get("/active-game", authenticateUser, fetchActiveGame)
router.delete("/delete-game", authenticateUser, deleteOldActiveGame)
router.patch("/update-game", authenticateUser, updateGame)
router.patch("/get-new-prompt/:gameId", authenticateUser, getNewPrompt)
// router.patch("/clearSeenIds/:gameId", authenticateUser, clearSeenIds)

export default router
