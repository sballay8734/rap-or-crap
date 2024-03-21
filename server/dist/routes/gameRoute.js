"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const verifyUser_1 = require("../middleware/verifyUser");
const router = express_1.default.Router();
router.post("/initialize-game", verifyUser_1.authenticateUser, gameController_1.initializeGame);
router.get("/active-game", verifyUser_1.authenticateUser, gameController_1.fetchActiveGame);
exports.default = router;
