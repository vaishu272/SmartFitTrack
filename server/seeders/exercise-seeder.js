import mongoose from "mongoose";
import dotenv from "dotenv";
import { Exercise } from "../models/exercise-model.js";
import { Achievement } from "../models/achievement-model.js";
import { connectDB } from "../utils/db.js";
import {
  EXERCISES,
  ACHIEVEMENTS,
  seedDatabaseIfEmpty,
} from "../utils/seed-if-empty.js";

dotenv.config();

const force = process.argv.includes("--force");

const run = async () => {
  try {
    await connectDB();

    if (force) {
      console.log("Force reseed: clearing exercises and achievements...");
      await Exercise.deleteMany();
      await Achievement.deleteMany();
      await Exercise.insertMany(EXERCISES);
      await Achievement.insertMany(ACHIEVEMENTS);
      console.log("Force reseed complete.");
    } else {
      await seedDatabaseIfEmpty();
      console.log("Seed check complete (skipped if data already exists).");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeder error", error);
    process.exit(1);
  }
};

run();
