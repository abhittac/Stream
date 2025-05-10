import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (the subscriber)
      required: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (the channel being subscribed to)
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
