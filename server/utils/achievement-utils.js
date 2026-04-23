import { User } from "../models/user-model.js";
import { Workout } from "../models/workout-model.js";
import { Achievement } from "../models/achievement-model.js";

/**
 * After a workout is saved, evaluate milestone achievements and append new ones to the user.
 */
export const checkAndUnlockAchievements = async (userId, totalCaloriesAllTime) => {
  const achievementsList = await Achievement.find();
  const userDoc = await User.findById(userId).populate("achievements");
  if (!userDoc) return;

  const unlockedIds = new Set(
    (userDoc.achievements || []).map((a) => a._id.toString()),
  );
  const toAdd = [];

  const addByTitle = (title) => {
    const ach = achievementsList.find((a) => a.title === title);
    if (ach && !unlockedIds.has(ach._id.toString())) {
      toAdd.push(ach._id);
      unlockedIds.add(ach._id.toString());
    }
  };

  const workoutCount = await Workout.countDocuments({ user: userId });
  if (workoutCount >= 1) addByTitle("First Workout");
  if (userDoc.currentStreak >= 7) addByTitle("7-Day Streak");
  if (userDoc.currentStreak >= 30) addByTitle("30-Day Streak");
  if (totalCaloriesAllTime >= 1000) addByTitle("1000 Total Calories");
  if (totalCaloriesAllTime >= 5000) addByTitle("5000 Total Calories");

  if (toAdd.length > 0) {
    userDoc.achievements.push(...toAdd);
    await userDoc.save();
  }
};
