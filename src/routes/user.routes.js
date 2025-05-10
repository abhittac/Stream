import express from "express";
import { registerUser } from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.middlewares.js";

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

export default router;
