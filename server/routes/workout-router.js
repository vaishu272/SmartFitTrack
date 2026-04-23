import express from "express";
import { getWorkouts, createWorkout } from "../controllers/workout-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getWorkouts);
router.post("/", authMiddleware, createWorkout);

export default router;
