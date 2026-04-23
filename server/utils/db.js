import mongoose from "mongoose";

// MongoDB connection
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connection Succesful to Database");
  } catch (error) {
    console.log("Database Connection failed");
    process.exit(0);
  }
};
