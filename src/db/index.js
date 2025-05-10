import mongoose from "mongoose";
import { DB_NAME, mongoURI } from "../constants.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${mongoURI}/${DB_NAME}`);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Optional: Decide if you want to terminate the process
  }
};
