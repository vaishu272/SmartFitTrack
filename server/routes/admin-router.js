import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { adminMiddleware } from "../middlewares/admin-middleware.js";
import {
  deleteAdminUser,
  getAdminContacts,
  getAdminStats,
  getAdminUsers,
  getAdminWorkouts,
  updateAdminUser,
  changeAdminPassword,
  logoutAllSessions,
  transferAdminRole,
  getAppConfig,
  updateAppConfig,
  deleteInactiveUsers,
} from "../controllers/admin-controller.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users", getAdminUsers);
router.put("/users/:id", updateAdminUser);
router.delete("/users/:id", deleteAdminUser);
router.get("/stats", getAdminStats);
router.get("/workouts", getAdminWorkouts);
router.get("/contacts", getAdminContacts);

router.post("/change-password", changeAdminPassword);
router.post("/logout-all", logoutAllSessions);
router.post("/transfer-role", transferAdminRole);
router.get("/config", getAppConfig);
router.put("/config", updateAppConfig);
router.delete("/inactive-users", deleteInactiveUsers);

export default router;
