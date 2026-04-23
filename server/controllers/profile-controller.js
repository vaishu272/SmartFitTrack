import streamifier from "streamifier";
import { User } from "../models/user-model.js";
import cloudinary from "../utils/cloudinary.js";

const getSafeFolderSlug = (name) =>
  (name || "user")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const getFileExtension = (filename) => filename.split(".").pop().toLowerCase();

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, email, height, weight, age, gender, fitnessGoal } =
      req.body;

    const existingEmail = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const user = await User.findById(userId);

    const updateData = {
      name: name ?? user.name,
      phone: phone ?? user.phone,
      email: email ?? user.email,
    };

    if (height) updateData["profile.height"] = Number(height);
    if (weight) updateData["profile.weight"] = Number(weight);
    if (age) updateData["profile.age"] = Number(age);
    if (gender) updateData["profile.gender"] = gender;
    if (fitnessGoal) updateData["profile.fitnessGoal"] = fitnessGoal;

    if (req.file) {
      if (user.avatar) {
        try {
          const publicId = user.avatar
            .split("/upload/")[1]
            .split("/")
            .slice(1)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId, { invalidate: true });
        } catch (e) {
          console.log("Cloudinary delete skipped:", e.message);
        }
      }

      const safeSlug = getSafeFolderSlug(name || user.name);

      const folderPath = `smartFitTrack/${safeSlug}/profile`;

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folderPath,
            resource_type: "auto",
          },
          (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      updateData.avatar = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
      runValidators: true,
    })
      .select("-password")
      .populate("achievements");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      userData: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Profile update failed",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both current and new password are required",
      });
    }

    const user = await User.findById(userId);

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ This triggers pre("save") and hashes automatically
    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Password change failed",
    });
  }
};
