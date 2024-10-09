import express from "express";
import {
  allUsers,
  userJobHistory,
  deleteUser,
  singleUser,
  updateUser,
} from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// user routes
// /api/user/allusers
router.get("/allusers", isAuthenticated, isAdmin, allUsers);
// /api/user/id
router.get("/user/:id", isAuthenticated, singleUser);
// /api/user/update/id
router.put("/user/update/:id", isAuthenticated, updateUser);
// /api/user/delete/id
router.delete("/admin/user/delete/:id", isAuthenticated, isAdmin, deleteUser);
// /api/user/jobhistory
router.post("/user/jobhistory", isAuthenticated, userJobHistory);

export default router;
