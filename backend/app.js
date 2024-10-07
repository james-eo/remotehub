import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import errorHandler from "./middleware/error.js";

// Import routes
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

//Connect to MongoDB
dotenv.config();
const PORT = process.env.PORT || 8000;

// Middleware: Parse incoming requests data.
// Use Morgan to log requests in 'dev' format

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(cors());

// ROUTES MIDDLEWARE
app.use("/api", authRoutes);
app.use("/api", userRoutes);
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// Error handling middleware
app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
