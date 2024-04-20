import express from "express"

import {
  // clearSeenIds,
  deleteOldActiveGame,
  fetchActiveGame,
  getNewPrompt,
  initializeGame,
  initializeGuestGame,
  updateGame
} from "../controllers/gameController"
import { authenticateUser } from "../middleware/authenticateUser"

const router = express.Router()

router.post("/initialize-game", authenticateUser, initializeGame)
router.get("/active-game", authenticateUser, fetchActiveGame)
router.delete("/delete-game", authenticateUser, deleteOldActiveGame)
router.patch("/update-game", authenticateUser, updateGame)
router.patch("/get-new-prompt/:gameId", authenticateUser, getNewPrompt)
// Not authenticating user for guest game
router.post("/intialize-guest-game", initializeGuestGame)

export default router
