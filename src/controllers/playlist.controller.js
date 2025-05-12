import { Playlist } from "../models/playlist.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Create a new playlist
 */
export const createPlaylist = asyncHandler(async (req, res, next) => {
  const { name, videos } = req.body;

  // Validate required fields
  if (!name) {
    throw new ApiError("Playlist name is required", 400);
  }

  // Create a new playlist
  const newPlaylist = await Playlist.create({
    name,
    videos: videos || [],
    userId: req.user.id, // Assuming the user is authenticated
  });

  const response = new ApiResponse(201, "Playlist created successfully", {
    playlist: newPlaylist,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Get all playlists for a user
 */
export const getUserPlaylists = asyncHandler(async (req, res, next) => {
  const playlists = await Playlist.find({ userId: req.user.id });

  const response = new ApiResponse(200, "Playlists fetched successfully", {
    playlists,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Add a video to a playlist
 */
export const addVideoToPlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId, videoId } = req.body;

  // Validate required fields
  if (!playlistId || !videoId) {
    throw new ApiError("Playlist ID and Video ID are required", 400);
  }

  // Add the video to the playlist
  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, userId: req.user.id },
    { $addToSet: { videos: videoId } }, // Prevent duplicate videos
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError("Playlist not found or not authorized", 404);
  }

  const response = new ApiResponse(200, "Video added to playlist", {
    playlist: updatedPlaylist,
  });
  return res.status(response.statusCode).json(response);
});

/**
 * Delete a playlist
 */
export const deletePlaylist = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Delete the playlist
  const deletedPlaylist = await Playlist.findOneAndDelete({
    _id: id,
    userId: req.user.id,
  });

  if (!deletedPlaylist) {
    throw new ApiError("Playlist not found or not authorized", 404);
  }

  const response = new ApiResponse(200, "Playlist deleted successfully");
  return res.status(response.statusCode).json(response);
});
