import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import jobTypeRoutes from "./routes/jobTypeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/error.js";
import { fetchAndStoreJobs } from "./controllers/jobController.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);
app.use("/api/job-types", jobTypeRoutes);
app.use("/api/users", userRoutes);

// Schedule job fetching every 6 hours
cron.schedule("0 */24 * * *", async () => {
  console.log("Fetching jobs from APIs...");
  try {
    await fetchAndStoreJobs();
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
