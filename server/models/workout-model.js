import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: [{
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    sets: {
      type: Number,
      default: 0,
    },
    reps: {
      type: Number,
      default: 0,
    },
  }],
  totalCaloriesBurned: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const Workout = mongoose.model("Workout", workoutSchema);
