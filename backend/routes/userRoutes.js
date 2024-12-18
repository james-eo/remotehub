import express from "express";
import {
  allUsers,
  userJobHistory,
  deleteUser,
  singleUser,
  updateUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/allusers", isAuthenticated, isAdmin, allUsers);
router.get("/user/:id", isAuthenticated, singleUser);
router.put("/user/update/:id", isAuthenticated, updateUser);
router.delete("/admin/user/delete/:id", isAuthenticated, isAdmin, deleteUser);
router.post("/user/jobhistory", isAuthenticated, userJobHistory);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile/update", isAuthenticated, updateUserProfile);

export default router;
