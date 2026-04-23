import { Workout } from "../models/workout-model.js";
import { User } from "../models/user-model.js";
import { Exercise } from "../models/exercise-model.js";
import { checkAndUnlockAchievements } from "../utils/achievement-utils.js";
import { updateStreak } from "../utils/streak-utils.js";

export const createWorkout = async (req, res) => {
  try {
    const { date, exercises, completed = true } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ message: "Add at least one exercise." });
    }

    let totalCaloriesBurned = 0;
    const populatedExercises = [];

    for (const ex of exercises) {
      const exerciseData = await Exercise.findById(ex.exerciseId);
      if (!exerciseData) {
        return res.status(400).json({ message: "One or more exercises are invalid." });
      }
      const duration = Number(ex.duration);
      if (!Number.isFinite(duration) || duration < 1) {
        return res
          .status(400)
          .json({ message: "Each exercise needs a duration of at least 1 minute." });
      }
      totalCaloriesBurned += exerciseData.caloriesPerMinute * duration;
      populatedExercises.push({
        exerciseId: ex.exerciseId,
        duration,
        sets: Number(ex.sets) || 0,
        reps: Number(ex.reps) || 0,
      });
    }

    const workout = new Workout({
      user: userId,
      date: date ? new Date(date) : new Date(),
      exercises: populatedExercises,
      totalCaloriesBurned,
      completed: completed !== false,
    });

    await workout.save();

    if (workout.completed) {
      const user = await User.findById(userId);
      if (user) {
        updateStreak(user);
        await user.save();
      }

      const allWorkouts = await Workout.find({ user: userId });
      const totalAllTimeCalories = allWorkouts.reduce(
        (sum, w) => sum + w.totalCaloriesBurned,
        0,
      );
      await checkAndUnlockAchievements(userId, totalAllTimeCalories);
    }

    const saved = await Workout.findById(workout._id).populate("exercises.exerciseId");
    return res.status(201).json(saved);
  } catch (error) {
    console.log(`Error in createWorkout: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user._id;
    const filterDate = req.query.date;

    const query = { user: userId };
    if (filterDate) {
      const start = new Date(filterDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filterDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const workouts = await Workout.find(query)
      .populate("exercises.exerciseId")
      .sort({ date: -1 });

    return res.status(200).json(workouts);
  } catch (error) {
    console.log(`Error in getWorkouts: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
