import express from "express";
import {
  createComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
} from "../controllers/comment.controllers.js";
import { authenticateToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Create a new comment (protected)
router.post("/", authenticateToken, createComment);

// Get comments for a specific video
router.get("/:videoId", getCommentsByVideo);

// Update a comment (protected)
router.put("/:id", authenticateToken, updateComment);

// Delete a comment (protected)
router.delete("/:id", authenticateToken, deleteComment);

export default router;
