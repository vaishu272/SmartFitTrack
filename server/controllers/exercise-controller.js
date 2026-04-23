import { Exercise } from "../models/exercise-model.js";

export const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({});
    return res.status(200).json(exercises);
  } catch (error) {
    console.log(`Error in getExercises: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
