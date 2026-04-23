import { User } from "../models/user-model.js";
import { updateStreak } from "../utils/streak-utils.js";
import { hashToken } from "../utils/hash-token.js";
import { OAuth2Client } from "google-auth-library";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generate-token.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const generateEmailOtp = () => crypto.randomInt(100000, 1000000).toString();

const buildOtpEmailTemplate = (name, otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
    <h2 style="color: #0ea5e9; margin-bottom: 16px;">Verify your SmartFitnessTracker account</h2>
    <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
    <p style="font-size: 15px; line-height: 1.6;">
      Use the OTP below to verify your email and activate your account.
    </p>
    <div style="margin: 24px 0; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #0ea5e9;">
      ${otp}
    </div>
    <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
      This OTP expires in 24 hours.
    </p>
    <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
      If you did not create this account, you can safely ignore this email.
    </p>
  </div>
`;

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isEmailVerified) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const otp = generateEmailOtp();
      userExists.name = name;
      userExists.password = password;
      userExists.phone = phone || "";
      userExists.emailVerificationToken = hashToken(otp);
      userExists.emailVerificationExpires = new Date(
        Date.now() + 15 * 60 * 1000,
      );
      await userExists.save();

      try {
        await sendEmail(
          userExists.email,
          "Your SmartFitnessTracker verification OTP",
          buildOtpEmailTemplate(userExists.name, otp),
        );
      } catch (err) {
        console.error("Email failed:", err);

        return res.status(500).json({
          message: "Failed to send verification email. Try again.",
        });
      }

      return res.status(200).json({
        message:
          "Email already registered but not verified. A new verification OTP has been sent.",
        requiresEmailVerification: true,
      });
    }

    const otp = generateEmailOtp();
    const hashedToken = hashToken(otp);

    const user = await User.create({
      name,
      email,
      phone: phone || "",
      password,
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendEmail(
      email,
      "Your SmartFitnessTracker verification OTP",
      buildOtpEmailTemplate(name, otp),
    );

    res.status(201).json({
      message: "Registration successful. Check your email for OTP.",
      requiresEmailVerification: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required for verification" });
    }

    const hashedOtp = hashToken(otp);

    const user = await User.findOne({
      email,
      emailVerificationToken: hashedOtp,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otpAttempts += 1;

    if (user.otpAttempts > 5) {
      return res.status(429).json({ message: "Too many attempts" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.log(`Error in verify email: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message:
          "If this email exists and is not verified, a verification email has been sent.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        message: "This email is already verified. Please log in.",
      });
    }

    const otp = generateEmailOtp();
    user.emailVerificationToken = hashToken(otp);
    user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendEmail(
      user.email,
      "Your SmartFitnessTracker verification OTP",
      buildOtpEmailTemplate(user.name, otp),
    );

    return res.status(200).json({
      message: "Verification OTP sent. Please check your inbox.",
    });
  } catch (error) {
    console.log(`Error in resend verification email: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const hashedIncoming = hashToken(refreshToken);
    const user = await User.findOne({ refreshToken: hashedIncoming });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    if (
      !user.refreshTokenExpiresAt ||
      user.refreshTokenExpiresAt < new Date()
    ) {
      user.refreshToken = null;
      user.refreshTokenExpiresAt = null;
      await user.save();

      return res.status(401).json({ message: "Refresh token expired" });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await userExist.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!userExist.isEmailVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in. Check your inbox for the OTP.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    const accessToken = generateAccessToken(userExist);
    const refreshToken = generateRefreshToken();

    userExist.refreshToken = hashToken(refreshToken);
    userExist.refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );
    
    updateStreak(userExist);
    await userExist.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      userId: userExist._id,
      user: {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        onboardingComplete: userExist.onboardingComplete,
        avatar: userExist.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const user = async (req, res) => {
  try {
    const userData = await User.findById(req.user._id)
      .select("-password")
      .populate("achievements");

    return res.status(200).json({ userData });
  } catch (error) {
    console.log(`Error from the user route: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const hashedIncoming = hashToken(refreshToken);
      await User.findOneAndUpdate(
        { refreshToken: hashedIncoming },
        { refreshToken: null },
      );
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

export const onboarding = async (req, res) => {
  try {
    const { height, weight, age, gender, fitnessGoal } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile = {
      height: Number(height),
      weight: Number(weight),
      age: Number(age),
      gender,
      fitnessGoal,
    };
    user.onboardingComplete = true;

    await user.save();

    return res.status(200).json({
      message: "Onboarding completed successfully",
      user,
    });
  } catch (error) {
    console.log(`Error in onboarding: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let userExist = await User.findOne({ email });

    if (userExist) {
      // Link Google account if not linked
      if (!userExist.googleId) {
        userExist.googleId = googleId;
      }
      // If user registered with email but didn't verify, verify them now
      if (!userExist.isEmailVerified) {
        userExist.isEmailVerified = true;
        userExist.emailVerificationToken = undefined;
        userExist.emailVerificationExpires = undefined;
      }
      if (!userExist.avatar && picture) {
        userExist.avatar = picture;
      }
      await userExist.save();
    } else {
      userExist = await User.create({
        name,
        email,
        googleId,
        avatar: picture || "",
        isEmailVerified: true,
      });
    }

    const accessToken = generateAccessToken(userExist);
    const refreshToken = generateRefreshToken();

    userExist.refreshToken = hashToken(refreshToken);
    userExist.refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );
    
    updateStreak(userExist);
    await userExist.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google login successful",
      accessToken,
      userId: userExist._id,
      user: {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        onboardingComplete: userExist.onboardingComplete,
        avatar: userExist.avatar,
      },
    });
  } catch (error) {
    console.log(`Error in google login: ${error}`);
    return res.status(500).json({ message: "Google Authentication Failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return same response (security)
    if (!user) {
      return res.status(200).json({
        message: "If email exists, reset otp sent to the email",
      });
    }

    const otp = generateEmailOtp();
    const hashedToken = hashToken(otp);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    await sendEmail(
      user.email,
      "Reset Your Password OTP",
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
        <h2 style="color: #0ea5e9; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="font-size: 15px; line-height: 1.6;">
          Use the OTP below to reset your password.
        </p>
        <div style="margin: 24px 0; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #0ea5e9;">
          ${otp}
        </div>
        <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
          This OTP expires in 15 minutes.
        </p>
      </div>`,
    );

    return res.status(200).json({
      message: "Reset otp sent to the email",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const hashedToken = hashToken(otp);

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
