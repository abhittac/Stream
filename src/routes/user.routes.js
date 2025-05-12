import express from "express";
import {
  loginUser,
  refreshTokenController,
  registerUser,
  updatePassword,
  logout,
} from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middlewares.js";
import { authenticateToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Register user route
router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log("Register route hit");
    next();
  },
  registerUser
);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenController);
// Update password route (protected)
router.put("/update-password", authenticateToken, updatePassword);

// Logout route
router.post("/logout", logout);
export default router;
