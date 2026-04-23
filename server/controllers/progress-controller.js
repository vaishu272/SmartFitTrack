import { WeightLog } from "../models/weight-log-model.js";
import { Workout } from "../models/workout-model.js";
import { User } from "../models/user-model.js";

export const createWeightLog = async (req, res) => {
  try {
    const { weight, date } = req.body;
    const userId = req.user._id;

    const log = new WeightLog({
      user: userId,
      weight: Number(weight),
      date: date ? new Date(date) : new Date(),
    });

    await log.save();

    const user = await User.findById(userId);
    if (user && user.profile) {
      user.profile.weight = Number(weight);
      await user.save();
    }

    return res.status(201).json(log);
  } catch (error) {
    console.log(`Error in createWeightLog: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWeightLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await WeightLog.find({ user: userId }).sort({ date: 1 });
    return res.status(200).json(logs);
  } catch (error) {
    console.log(`Error in getWeightLogs: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const userDoc = await User.findById(userId).populate("achievements");

    const allWorkouts = await Workout.find({ user: userId }).sort({ date: -1 });
    const totalWorkouts = allWorkouts.length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const recentWorkouts = allWorkouts.filter((w) => new Date(w.date) >= oneWeekAgo);

    const caloriesPerDay = Array(7).fill(0);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    recentWorkouts.forEach((w) => {
      const wd = new Date(w.date);
      wd.setHours(0, 0, 0, 0);
      const diffDays = Math.round((todayStart - wd) / 86400000);
      if (diffDays >= 0 && diffDays < 7) {
        const idx = 6 - diffDays;
        caloriesPerDay[idx] += w.totalCaloriesBurned;
      }
    });

    const totalCaloriesThisWeek = recentWorkouts.reduce(
      (sum, w) => sum + w.totalCaloriesBurned,
      0,
    );

    const weightLogs = await WeightLog.find({ user: userId }).sort({ date: 1 });

    const achievements = userDoc?.achievements || [];
    const recentAchievements = [...achievements].reverse().slice(0, 5);

    return res.status(200).json({
      totalWorkouts,
      totalCaloriesThisWeek,
      currentStreak: userDoc?.streak?.current ?? 0,
      longestStreak: userDoc?.streak?.longest ?? 0,
      recentAchievements,
      weightTrend: weightLogs,
      caloriesPerDay,
    });
  } catch (error) {
    console.log(`Error in getDashboardStats: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
