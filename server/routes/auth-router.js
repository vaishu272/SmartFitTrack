import express from "express";
import {
  register,
  login,
  adminLogin,
  user,
  logout,
  refreshAccessToken,
  onboarding,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
} from "../controllers/auth-controller.js";
import { validate } from "../middlewares/validate-middleware.js";
import {
  loginSchema,
  signupSchema,
  onboardingSchema,
} from "../validators/auth-validator.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  changePassword,
  updateProfile,
} from "../controllers/profile-controller.js";

const router = express.Router();

router.post("/register", validate(signupSchema), register);

router.post("/login", validate(loginSchema), login);
router.post("/admin/login", validate(loginSchema), adminLogin);

router.post("/google-login", googleLogin);

router.post("/refresh", refreshAccessToken);

router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateProfile,
);

router.put("/change-password", authMiddleware, changePassword);

router.get("/user", authMiddleware, user);

router.post("/logout", logout);

router.put(
  "/onboarding",
  authMiddleware,
  validate(onboardingSchema),
  onboarding,
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
