import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Cardio", "Strength", "Flexibility", "Balance"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  caloriesPerMinute: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export const Exercise = mongoose.model("Exercise", exerciseSchema);
