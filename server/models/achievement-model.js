import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String, // emoji or path
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Achievement = mongoose.model("Achievement", achievementSchema);
