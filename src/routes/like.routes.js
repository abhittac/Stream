import express from "express";
import {
  toggleLike,
  getLikesByVideo,
} from "../controllers/like.controllers.js";
import { authenticateToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Like or unlike a video (protected)
router.post("/", authenticateToken, toggleLike);

// Get total likes for a specific video
router.get("/:videoId", getLikesByVideo);

export default router;
