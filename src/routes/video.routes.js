import express from "express";
import {
  getVideos,
  getVideoStats,
  getVideoById,
  createVideo,
  deleteVideo,
} from "../controllers/video.controllers.js";
import { authenticateToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Public routes
router.get("/", getVideos); // Fetch videos with filters, sorting, and pagination
router.get("/stats", getVideoStats); // Fetch video statistics
router.get("/:id", getVideoById); // Fetch a single video by ID

// Protected routes
router.post("/", authenticateToken, createVideo); // Create a new video
router.delete("/:id", authenticateToken, deleteVideo); // Delete a video by ID

export default router;
