import mongoose from "mongoose";

const weightLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  weight: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export const WeightLog = mongoose.model("WeightLog", weightLogSchema);
