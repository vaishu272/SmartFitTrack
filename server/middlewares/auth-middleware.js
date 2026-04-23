import jwt from "jsonwebtoken";
import { User } from "../models/user-model.js";

export const authMiddleware = async (req, res, next) => {
  let token;

  // First, check cookies if you're using httpOnly cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to checking the Authorization header (optional)
  else if (
    req.header("Authorization") &&
    req.header("Authorization").startsWith("Bearer")
  ) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Please sign in for access" });
  }

  try {
    const isVerified = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "");

    // Getting user details minus the password
    const userData = await User.findById(
      isVerified.userId || isVerified.id,
    ).select("-password");

    if (!userData) {
      return res
        .status(401)
        .json({ message: "Unauthorized, Sign in to access" });
    }

    req.token = token;
    req.user = userData;
    req.userId = userData._id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, Invalid Token" });
  }
};
