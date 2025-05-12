import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Ensure a user can like a video only once
likeSchema.index({ videoId: 1, userId: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
