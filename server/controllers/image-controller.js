import streamifier from "streamifier";
import { User } from "../models/user-model.js";
import cloudinary from "../utils/cloudinary.js";

const getSafeUsername = (username) =>
  username.toLowerCase().replace(/\s+/g, "-");

const getFileExtension = (filename) => filename.split(".").pop().toLowerCase();

const convertToMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

// reusable per-user storage updater
const updateUserStorage = async (userId, bytes) => {
  await User.findByIdAndUpdate(userId, {
    $inc: { storageUsed: bytes },
  });
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, phone, email } = req.body;

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
      username,
      phone,
      email,
    };

    // Upload new profile image
    if (req.file) {
      // delete old image first
      if (user.profileImage) {
        const publicId = user.profileImage
          .split("/upload/")[1]
          .split("/")
          .slice(1)
          .join("/")
          .split(".")[0];

        console.log("Deleting public id:", publicId);

        await cloudinary.uploader.destroy(publicId, {
          invalidate: true,
        });
      }

      const safeUsername = getSafeUsername(username || user.username);

      const folderPath = `authhub/${safeUsername}/profile`;

      // upload new image using streamifier
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folderPath,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      await updateUserStorage(userId, req.file.size);

      const currentUser = await User.findById(userId).select("storageUsed");

      console.log(
        `${safeUsername} profile storage used:`,
        convertToMB(currentUser.storageUsed),
        "MB",
      );

      try {
        const usage = await cloudinary.api.usage();

        console.log("Cloudinary total storage:", usage.storage.usage);

        console.log(
          "Cloudinary total storage:",
          convertToMB(usage.storage.usage),
          "MB",
        );
      } catch (usageError) {
        console.log("Usage API timeout:", usageError.message);
      }

      updateData.profileImage = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    console.log("Update profile image data:", updateData.profileImage);

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

export const uploadGallery = async (req, res) => {
  try {
    const userId = req.user._id;
    const imageUrls = [];

    const safeUsername = getSafeUsername(req.user.username);

    const totalUploadSize = req.files.reduce((sum, file) => sum + file.size, 0);
    console.log(
      "Gallery total request size:",
      convertToMB(totalUploadSize),
      "MB",
    );

    for (const file of req.files) {
      const extension = getFileExtension(file.originalname);

      const folderPath = `authhub/${safeUsername}/gallery/${extension}`;

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folderPath,
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      console.log(
        `${file.originalname} uploaded:`,
        convertToMB(file.size),
        "MB",
      );
      imageUrls.push(result.secure_url);
    }

    await updateUserStorage(userId, totalUploadSize);

    const updatedStorage = await User.findById(userId).select("storageUsed");

    console.log(
      `${safeUsername} total storage:`,
      convertToMB(updatedStorage.storageUsed),
      "MB",
    );

    try {
      const usage = await cloudinary.api.usage();

      console.log(
        "Cloudinary total storage:",
        convertToMB(usage.storage.usage),
        "MB",
      );
    } catch (usageError) {
      console.log("Usage API timeout:", usageError.message);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          galleryImages: { $each: imageUrls },
        },
      },
      { returnDocument: "after" },
    );

    res.status(200).json({
      message: "Gallery uploaded successfully",
      userData: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gallery upload failed",
    });
  }
};

export const fetchGalleryImages = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("galleryImages");

    res.status(200).json({
      galleryImages: user?.galleryImages || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch gallery images",
    });
  }
};
