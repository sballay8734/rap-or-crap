"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const router = express_1.default.Router();
router.post("/signup", authController_1.signup);
router.post("/signup-guest", authController_1.signupGuest);
router.post("/signin", authController_1.signin);
router.post("/signout", authenticateUser_1.authenticateUser, authController_1.signout);
exports.default = router;
