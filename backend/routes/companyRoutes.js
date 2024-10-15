import express from "express";
import {
  getCompanyReviews,
  addCompanyReview,
} from "../controllers/companyController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id/reviews", getCompanyReviews);
router.post("/:id/reviews", isAuthenticated, addCompanyReview);

export default router;
