import { Like } from "../models/like.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Like or unlike a video
 */
export const toggleLike = asyncHandler(async (req, res, next) => {
  const { videoId } = req.body;

  // Validate required fields
  if (!videoId) {
    throw new ApiError("Video ID is required", 400);
  }

  // Check if the user has already liked the video
  const existingLike = await Like.findOne({ videoId, userId: req.user.id });

  if (existingLike) {
    // If the like exists, remove it (unlike)
    await existingLike.deleteOne();
    const response = new ApiResponse(200, "Video unliked successfully");
    return res.status(response.statusCode).json(response);
  } else {
    // If the like doesn't exist, create it
    const newLike = await Like.create({
      videoId,
      userId: req.user.id,
    });
    const response = new ApiResponse(201, "Video liked successfully", {
      like: newLike,
    });
    return res.status(response.statusCode).json(response);
  }
});

/**
 * Get total likes for a video
 */
export const getLikesByVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  // Validate videoId
  if (!videoId) {
    throw new ApiError("Video ID is required", 400);
  }

  // Count the total likes for the video
  const totalLikes = await Like.countDocuments({ videoId });

  const response = new ApiResponse(200, "Total likes fetched successfully", {
    videoId,
    totalLikes,
  });
  return res.status(response.statusCode).json(response);
});
