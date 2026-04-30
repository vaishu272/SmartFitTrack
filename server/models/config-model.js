import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    singletonId: {
      type: String,
      default: "app-config",
      unique: true,
    },
    enableWorkouts: {
      type: Boolean,
      default: true,
    },
    enableContactForm: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const AppConfig = mongoose.model("AppConfig", configSchema);
