import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video", // Reference to the Video model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);
commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);
