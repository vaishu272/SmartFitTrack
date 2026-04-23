import { User } from "../models/user-model.js";

export const getStreakData = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const streak = user.streak || {
      current: 0,
      longest: 0,
      activityDates: [],
    };

    return res.status(200).json(streak);
  } catch (error) {
    console.log(`Error in getStreakData: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
