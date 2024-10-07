import express from "express";
import {
  signup,
  signin,
  signout,
  userProfile,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// /api/signup
router.post("/signup", signup);
// /api/signin
router.post("/signin", signin);
// /api/signout
router.get("/signout", signout);
// /api/me
router.get("/me", isAuthenticated, userProfile);

export default router;
