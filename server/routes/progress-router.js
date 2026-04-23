import express from "express";
import { createWeightLog, getWeightLogs, getDashboardStats } from "../controllers/progress-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/weight", authMiddleware, createWeightLog);
router.get("/weight", authMiddleware, getWeightLogs);
router.get("/dashboard/stats", authMiddleware, getDashboardStats);

export default router;
