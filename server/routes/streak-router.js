import express from "express";
import { getStreakData } from "../controllers/streak-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getStreakData);

export default router;
