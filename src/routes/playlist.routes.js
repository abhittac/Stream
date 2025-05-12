import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  addVideoToPlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";
import { authenticateToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Create a new playlist (protected)
router.post("/", authenticateToken, createPlaylist);

// Get all playlists for the authenticated user (protected)
router.get("/", authenticateToken, getUserPlaylists);

// Add a video to a playlist (protected)
router.put("/add-video", authenticateToken, addVideoToPlaylist);

// Delete a playlist (protected)
router.delete("/:id", authenticateToken, deletePlaylist);

export default router;
