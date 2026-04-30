import mongoose from "mongoose";
import { User } from "../models/user-model.js";
import { Workout } from "../models/workout-model.js";
import { Contact } from "../models/contact-model.js";
import { AppConfig } from "../models/config-model.js";
import bcrypt from "bcryptjs";

export const getAdminUsers = async (req, res) => {
  try {
    const { search = "", role = "", verified = "" } = req.query;
    const query = {};

    if (!req.query.includeAdmin) {
      query.role = "user";
    }

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }
    if (role === "user") {
      query.role = "user";
    }
    if (verified === "true" || verified === "false") {
      query.isEmailVerified = verified === "true";
    }

    const users = await User.find(query)
      .select(
        "name email phone role isEmailVerified onboardingComplete createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ users });
  } catch {
    return res.status(500).json({ message: "Failed to load users" });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot be modified" });
    }

    if (typeof name === "string" && name.trim()) user.name = name.trim();
    if (typeof phone === "string") user.phone = phone.trim();
    if (role === "admin") {
      return res.status(403).json({ message: "Cannot assign admin role" });
    }

    if (role === "user") {
      user.role = "user";
    }

    await user.save();

    return res.status(200).json({
      message: "User updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(400)
        .json({ message: "Only one admin account is allowed" });
    }
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot be deleted" });
    }

    await Promise.all([
      User.deleteOne({ _id: id }),
      Workout.deleteMany({ user: id }),
    ]);

    return res
      .status(200)
      .json({ message: "User and related workouts deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getAdminWorkouts = async (req, res) => {
  try {
    const { userId, date } = req.query;
    const query = {};

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.user = userId;
    }
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const workouts = await Workout.find(query)
      .populate("user", "name email")
      .populate("exercises.exerciseId", "name category")
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({ workouts });
  } catch {
    return res.status(500).json({ message: "Failed to load workouts" });
  }
};

export const getAdminContacts = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = {};
    if (search.trim()) {
      query.$or = [
        { username: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
        { message: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const contacts = await Contact.find(query)
      .select("username email message createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ contacts });
  } catch {
    return res.status(500).json({ message: "Failed to load contacts" });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalWorkouts,
      totalContacts,
      activeUsersAgg,
      caloriesAgg,
      growthTrend,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Workout.countDocuments(),
      Contact.countDocuments(),
      Workout.aggregate([
        { $match: { date: { $gte: sevenDaysAgo } } },
        { $group: { _id: "$user" } },
        { $count: "activeUsers" },
      ]),
      Workout.aggregate([
        { $match: { date: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: null,
            totalCalories: { $sum: "$totalCaloriesBurned" },
          },
        },
      ]),
      User.aggregate([
        { $match: { role: "user" } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 14 },
      ]),
    ]);

    const workoutsByDay = await Workout.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          workouts: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      totalUsers,
      totalWorkouts,
      totalContacts,
      activeUsers: activeUsersAgg[0]?.activeUsers || 0,
      caloriesLogged7Days: caloriesAgg[0]?.totalCalories || 0,
      growthTrend,
      workoutsByDay,
      dbStatus: mongoose.connection.readyState,
    });
  } catch {
    return res.status(500).json({ message: "Failed to load stats" });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to change password" });
  }
};

export const logoutAllSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.refreshToken = null;
    await user.save();
    return res.status(200).json({ message: "Logged out of all other sessions" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to logout sessions" });
  }
};

export const transferAdminRole = async (req, res) => {
  try {
    const { newAdminEmail } = req.body;
    if (!newAdminEmail) return res.status(400).json({ message: "Email is required" });

    const newAdmin = await User.findOne({ email: newAdminEmail });
    if (!newAdmin) return res.status(404).json({ message: "User not found" });
    
    if (newAdmin.role === "admin") return res.status(400).json({ message: "User is already an admin" });

    const currentAdmin = await User.findById(req.user._id);
    
    newAdmin.role = "admin";
    currentAdmin.role = "user";

    // Only one admin can exist due to partialFilterExpression on unique index
    // So we must demote current admin first
    await currentAdmin.save();
    try {
      await newAdmin.save();
    } catch (err) {
      // Revert if saving new admin fails
      currentAdmin.role = "admin";
      await currentAdmin.save();
      throw err;
    }

    return res.status(200).json({ message: "Admin role transferred successfully" });
  } catch (error) {
    console.error("Transfer role error:", error);
    return res.status(500).json({ message: "Failed to transfer admin role" });
  }
};

export const getAppConfig = async (req, res) => {
  try {
    let config = await AppConfig.findOne({ singletonId: "app-config" });
    if (!config) {
      config = await AppConfig.create({});
    }
    return res.status(200).json(config);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch config" });
  }
};

export const updateAppConfig = async (req, res) => {
  try {
    const { enableWorkouts, enableContactForm, maintenanceMode } = req.body;
    let config = await AppConfig.findOne({ singletonId: "app-config" });
    if (!config) {
      config = new AppConfig();
    }
    
    if (enableWorkouts !== undefined) config.enableWorkouts = enableWorkouts;
    if (enableContactForm !== undefined) config.enableContactForm = enableContactForm;
    if (maintenanceMode !== undefined) config.maintenanceMode = maintenanceMode;
    
    await config.save();
    return res.status(200).json({ message: "Configuration updated", config });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update config" });
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inactiveUsers = await User.find({
      role: "user",
      createdAt: { $lt: thirtyDaysAgo },
      $or: [
        { "streak.lastActiveDate": { $exists: false } },
        { "streak.lastActiveDate": null },
        { "streak.lastActiveDate": { $lt: thirtyDaysAgo } }
      ]
    });

    const userIds = inactiveUsers.map(u => u._id);
    
    await Promise.all([
      User.deleteMany({ _id: { $in: userIds } }),
      Workout.deleteMany({ user: { $in: userIds } })
    ]);

    return res.status(200).json({ message: `Successfully deleted ${userIds.length} inactive users` });
  } catch (error) {
    console.error("Delete inactive error:", error);
    return res.status(500).json({ message: "Failed to delete inactive users" });
  }
};
