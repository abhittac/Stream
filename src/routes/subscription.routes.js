import express from "express";
import {
  subscribe,
  unsubscribe,
  getUserSubscriptions,
} from "../controllers/subscription.controllers.js";
import { authenticateToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Subscribe to a channel (protected)
router.post("/", authenticateToken, subscribe);

// Unsubscribe from a channel (protected)
router.delete("/", authenticateToken, unsubscribe);

// Get all subscriptions for the authenticated user (protected)
router.get("/", authenticateToken, getUserSubscriptions);

export default router;
