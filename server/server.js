import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth-router.js";
import contactRoute from "./routes/contact-router.js";
import exerciseRoute from "./routes/exercise-router.js";
import workoutRoute from "./routes/workout-router.js";
import progressRoute from "./routes/progress-router.js";
import streakRoute from "./routes/streak-router.js";
import adminRoute from "./routes/admin-router.js";
import { connectDB } from "./utils/db.js";
import { seedDatabaseIfEmpty } from "./utils/seed-if-empty.js";
import { assignSingleAdminFromEnv } from "./utils/assign-admin.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Define the rate limiting rules
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes", // Error message
});

// Apply rate limiting middleware to all requests (or specific routes)
app.use("/api/auth/register", apiLimiter);
app.use("/api/auth/login", apiLimiter);
app.use("/api/auth/verify-email", apiLimiter);
app.use("/api/auth/resend-verification-email", apiLimiter);

const validationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Too many validation requests from this IP, please try again after 1 minute",
});

app.use("/api/auth/validate-field", validationLimiter);

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount router: mount at a specific URL prefix
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/exercises", exerciseRoute);
app.use("/api/workouts", workoutRoute);
app.use("/api/progress", progressRoute);
app.use("/api/dashboard", progressRoute); // Dashboard is also in progress router
app.use("/api/streak", streakRoute);
app.use("/api/admin", adminRoute);

app.use(errorMiddleware);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log("Database Connection failed:", error.message);
    process.exit(1); // stop app clearly
  }
};

process.on("SIGINT", async () => {
  console.log("Server shutting down...");
  await mongoose.disconnect();
  process.exit(0);
});
