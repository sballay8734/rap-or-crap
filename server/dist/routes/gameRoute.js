"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const router = express_1.default.Router();
router.post("/initialize-game", authenticateUser_1.authenticateUser, gameController_1.initializeGame);
router.get("/active-game", authenticateUser_1.authenticateUser, gameController_1.fetchActiveGame);
router.delete("/delete-game", authenticateUser_1.authenticateUser, gameController_1.deleteOldActiveGame);
router.patch("/update-game", authenticateUser_1.authenticateUser, gameController_1.updateGame);
router.patch("/get-new-prompt/:gameId", authenticateUser_1.authenticateUser, gameController_1.getNewPrompt);
// Not authenticating user for guest game
router.post("/intialize-guest-game", gameController_1.initializeGuestGame);
exports.default = router;
