import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    videos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video", // Reference to the Video model
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Reference to the User model
    },

    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
