import express from "express";
import {
  createJobType,
  allJobType,
  updateJobType,
  deleteJobType,
} from "../controllers/jobTypeController.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Job type routes

// /api/type/create
router.post("/type/create", isAuthenticated, createJobType);

// /api/type/jobs
router.get("/type/jobs", allJobType);
// /api/type/update/type_id
router.put("/type/update/:type_id", isAuthenticated, isAdmin, updateJobType);
// /api/type/delete/type_id
router.delete("/type/delete/:type_id", isAuthenticated, isAdmin, deleteJobType);

export default router;
