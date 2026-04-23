import { Exercise } from "../models/exercise-model.js";
import { Achievement } from "../models/achievement-model.js";

export const EXERCISES = [
  { name: "Running", category: "Cardio", difficulty: "Intermediate", caloriesPerMinute: 10 },
  { name: "Cycling", category: "Cardio", difficulty: "Beginner", caloriesPerMinute: 8 },
  { name: "Jump Rope", category: "Cardio", difficulty: "Intermediate", caloriesPerMinute: 12 },
  { name: "Swimming", category: "Cardio", difficulty: "Advanced", caloriesPerMinute: 11 },
  { name: "Push-ups", category: "Strength", difficulty: "Intermediate", caloriesPerMinute: 7 },
  { name: "Pull-ups", category: "Strength", difficulty: "Advanced", caloriesPerMinute: 8 },
  { name: "Squats", category: "Strength", difficulty: "Beginner", caloriesPerMinute: 6 },
  { name: "Deadlifts", category: "Strength", difficulty: "Advanced", caloriesPerMinute: 9 },
  { name: "Bench Press", category: "Strength", difficulty: "Intermediate", caloriesPerMinute: 7 },
  { name: "Yoga", category: "Flexibility", difficulty: "Beginner", caloriesPerMinute: 4 },
  { name: "Pilates", category: "Flexibility", difficulty: "Intermediate", caloriesPerMinute: 5 },
  { name: "Plank", category: "Strength", difficulty: "Beginner", caloriesPerMinute: 5 },
  { name: "Burpees", category: "Cardio", difficulty: "Advanced", caloriesPerMinute: 13 },
  { name: "Lunges", category: "Strength", difficulty: "Beginner", caloriesPerMinute: 6 },
  { name: "Tai Chi", category: "Balance", difficulty: "Beginner", caloriesPerMinute: 3 },
];

export const ACHIEVEMENTS = [
  { title: "First Workout", icon: "🎉", description: "Logged your first workout in SmartFitnessTracker." },
  { title: "7-Day Streak", icon: "🔥", description: "Worked out for 7 consecutive days." },
  { title: "30-Day Streak", icon: "🏆", description: "A whole month of consecutive workouts!" },
  { title: "1000 Total Calories", icon: "💥", description: "Burned over 1,000 total calories." },
  { title: "5000 Total Calories", icon: "☄️", description: "Burned an impressive 5,000 total calories." },
];

export async function seedDatabaseIfEmpty() {
  const achCount = await Achievement.countDocuments();
  if (achCount === 0) {
    await Achievement.insertMany(ACHIEVEMENTS);
    console.log("Seeded achievements catalog.");
  }
  const exCount = await Exercise.countDocuments();
  if (exCount === 0) {
    await Exercise.insertMany(EXERCISES);
    console.log("Seeded exercise library.");
  }
}
