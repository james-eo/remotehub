import express from "express";
import { getResume, updateResume } from "../controllers/resumeController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getResume);
router.put("/", updateResume);

export default router;
