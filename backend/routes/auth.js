import express from "express";
import { signin } from "../controllers/authController.js";

const router = express.Router();

// auth routes

router.get("/", signin);

export default router;
