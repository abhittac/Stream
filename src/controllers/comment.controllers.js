import { Comment } from "../models/comment.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Create a new comment
 */
export const createComment = asyncHandler(async (req, res, next) => {
  const { content, videoId } = req.body;

  // Validate required fields
  if (!content || !videoId) {
    throw new ApiError("Content and videoId are required", 400);
  }

  // Create a new comment
  const newComment = await Comment.create({
    content,
    videoId,
    userId: req.user.id, // Assuming the user is authenticated
  });

  const response = new ApiResponse(201, "Comment created successfully", {
    comment: newComment,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Get comments for a specific video
 */
export const getCommentsByVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  // Validate videoId
  if (!videoId) {
    throw new ApiError("Video ID is required", 400);
  }

  // Fetch comments with user details using aggregation
  const comments = await Comment.aggregate([
    { $match: { videoId } },
    {
      $lookup: {
        from: "users", // The name of the User collection
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" }, // Flatten the userDetails array
    {
      $project: {
        content: 1,
        createdAt: 1,
        "userDetails.username": 1,
        "userDetails.avatar": 1,
      },
    },
  ]);

  const response = new ApiResponse(200, "Comments fetched successfully", {
    comments,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Update a comment
 */
export const updateComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  // Validate required fields
  if (!content) {
    throw new ApiError("Content is required", 400);
  }

  // Find and update the comment
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: id, userId: req.user.id }, // Ensure the user owns the comment
    { content },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError("Comment not found or not authorized", 404);
  }

  const response = new ApiResponse(200, "Comment updated successfully", {
    comment: updatedComment,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Delete a comment
 */
export const deleteComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find and delete the comment
  const deletedComment = await Comment.findOneAndDelete({
    _id: id,
    userId: req.user.id, // Ensure the user owns the comment
  });

  if (!deletedComment) {
    throw new ApiError("Comment not found or not authorized", 404);
  }

  const response = new ApiResponse(200, "Comment deleted successfully");
  return res.status(response.statusCode).json(response);
});
