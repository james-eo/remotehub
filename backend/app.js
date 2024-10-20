import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/error.js";
import { fetchAndStoreJobs } from "./controllers/jobController.js";
import companyRoutes from "./routes/companyRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// Load environment variables
dotenv.config();

// Start server
const PORT = process.env.PORT || 5000;
// Connect to database
connectDB();

const app = express();

// Cookie parser
app.use(cookieParser());

// Middleware

app.use(cors({
  origin: 'https://remotehub-485cycvgn-jamesejike04-gmailcoms-projects.vercel.app'
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);
// app.use("/api/job-types", jobTypeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/resume", resumeRoutes);

// Schedule job fetching every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("Fetching jobs from APIs...");
  try {
    await fetchAndStoreJobs();
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
