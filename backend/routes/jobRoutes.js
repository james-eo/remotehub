import express from "express";
import {
  getJobs,
  getJob,
  fetchAndStoreJobs,
  // getJobRecommendations,
} from "../controllers/jobController.js";
// import { fetchAndStoreJobs } from "../services/jobService.js";
// import {
//   createJob,
//   singleJob,
//   updateJob,
//   listJobs,
// } from "../controllers/jobController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
// Jobs routes

// // /api/job/create
// router.post("/job/create", isAuthenticated, isAdmin, createJob);

// // /api/job/id
// router.get("/job/:id", singleJob);

// // /api/job/update/job_id
// router.put("/job/update/:job_id", isAuthenticated, isAdmin, updateJob);

// /api/jobs/list
// router.get("/jobs/list", listJobs);
// router.get("/", getJobs);
router.get("/jobs", getJobs);
router.get("/jobs/:id", getJob);
router.post("/jobs/fetch", isAuthenticated, isAdmin, fetchAndStoreJobs);
// router.get("/recommendations", isAuthenticated, getJobRecommendations);

export default router;
