import { Subscription } from "../models/subscription.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Subscribe to a channel
 */
export const subscribe = asyncHandler(async (req, res, next) => {
  const { channelId } = req.body;

  // Validate required fields
  if (!channelId) {
    throw new ApiError("Channel ID is required", 400);
  }

  // Check if the user is already subscribed
  const existingSubscription = await Subscription.findOne({
    channelId,
    userId: req.user.id,
  });

  if (existingSubscription) {
    throw new ApiError("Already subscribed to this channel", 400);
  }

  // Create a new subscription
  const newSubscription = await Subscription.create({
    channelId,
    userId: req.user.id,
  });

  const response = new ApiResponse(201, "Subscribed successfully", {
    subscription: newSubscription,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Unsubscribe from a channel
 */
export const unsubscribe = asyncHandler(async (req, res, next) => {
  const { channelId } = req.body;

  // Validate required fields
  if (!channelId) {
    throw new ApiError("Channel ID is required", 400);
  }

  // Delete the subscription
  const deletedSubscription = await Subscription.findOneAndDelete({
    channelId,
    userId: req.user.id,
  });

  if (!deletedSubscription) {
    throw new ApiError("Subscription not found", 404);
  }

  const response = new ApiResponse(200, "Unsubscribed successfully");
  return res.status(response.statusCode).json(response);
});

/**
 * Get all subscriptions for a user
 */
export const getUserSubscriptions = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find({
    userId: req.user.id,
  }).populate("channelId");

  const response = new ApiResponse(200, "Subscriptions fetched successfully", {
    subscriptions,
  });
  return res.status(response.statusCode).json(response);
});
