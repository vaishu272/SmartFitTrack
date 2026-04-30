import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role || "user",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};
