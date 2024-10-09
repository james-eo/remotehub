import express from "express";
import { createJobType, allJobType } from "../controllers/jobTypeController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Job type routes

// /api/type/create
router.post("/type/create", isAuthenticated, createJobType);

// /api/type/jobs
router.get("/type/jobs", allJobType);

export default router;
