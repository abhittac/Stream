import { Video } from "../models/video.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Get videos with aggregation pipeline
 * Example: Fetch videos with filters, sorting, and pagination
 */
export const getVideos = asyncHandler(async (req, res, next) => {
  const { category, minViews, sortBy, page = 1, limit = 10 } = req.query;

  // Build the aggregation pipeline
  const pipeline = [];

  // Filter by category
  if (category) {
    pipeline.push({ $match: { category } });
  }

  // Filter by minimum views
  if (minViews) {
    pipeline.push({ $match: { views: { $gte: parseInt(minViews) } } });
  }

  // Sort by a specific field
  if (sortBy) {
    const sortOrder = sortBy.startsWith("-") ? -1 : 1;
    const sortField = sortBy.replace("-", "");
    pipeline.push({ $sort: { [sortField]: sortOrder } });
  }

  // Pagination
  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: parseInt(limit) });

  // Execute the aggregation pipeline
  const videos = await Video.aggregate(pipeline);

  // Send response
  const response = new ApiResponse(200, "Videos fetched successfully", {
    videos,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Get video statistics
 * Example: Aggregate total views, likes, and count by category
 */
export const getVideoStats = asyncHandler(async (req, res, next) => {
  const stats = await Video.aggregate([
    {
      $group: {
        _id: "$category",
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: "$likes" },
        videoCount: { $count: {} },
      },
    },
    { $sort: { totalViews: -1 } }, // Sort by total views in descending order
  ]);

  // Send response
  const response = new ApiResponse(
    200,
    "Video statistics fetched successfully",
    { stats }
  );
  return res.status(response.statusCode).json(response);
});

/**
 * Get a single video by ID
 */
export const getVideoById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError("Video not found", 404);
  }

  const response = new ApiResponse(200, "Video fetched successfully", {
    video,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Create a new video
 */
export const createVideo = asyncHandler(async (req, res, next) => {
  const { title, category, views, likes, uploadedBy } = req.body;

  const newVideo = await Video.create({
    title,
    category,
    views,
    likes,
    uploadedBy,
  });

  const response = new ApiResponse(201, "Video created successfully", {
    video: newVideo,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Delete a video by ID
 */
export const deleteVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const video = await Video.findByIdAndDelete(id);
  if (!video) {
    throw new ApiError("Video not found", 404);
  }

  const response = new ApiResponse(200, "Video deleted successfully");
  return res.status(response.statusCode).json(response);
});
