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

// TODO: **********************************************************************
// TODO: **********************************************************************
// TODO: **********************************************************************
// TODO: **********************************************************************
// TODO: **********************************************************************

// TODO: Add console logs in active-game to see what route is being triggered on logout and causing "unauthorized" error response

// TODO: Also, look into "fetchActiveGame" sometimes appearing inside modals to render and not being removed (hard to replicate but keep and eye on it)

// TODO: **********************************************************************
// TODO: **********************************************************************
// TODO: **********************************************************************
// TODO: **********************************************************************
// TODO: **********************************************************************
router.get("/active-game", authenticateUser, fetchActiveGame)
router.delete("/delete-game", authenticateUser, deleteOldActiveGame)
router.patch("/update-game", authenticateUser, updateGame)
router.patch("/get-new-prompt/:gameId", authenticateUser, getNewPrompt)

export default router
