import express from "express"
import {
  signup,
  signin,
  signout,
  signupGuest
} from "../controllers/authController"
import { authenticateUser } from "../middleware/authenticateUser"

const router = express.Router()

router.post("/signup", signup)
router.post("/signup-guest", signupGuest)
router.post("/signin", signin)
router.post("/signout", authenticateUser, signout)

export default router
