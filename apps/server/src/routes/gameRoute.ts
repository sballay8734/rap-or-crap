import express from "express";

import { initializeGame } from "../controllers/gameController";

const router = express.Router();

router.post("/initialize-game", initializeGame);

export default router;
