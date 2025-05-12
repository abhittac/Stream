import express from "express";
import { loginUser, registerUser } from "../controllers/user.controllers.js";
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
router.post("/login", loginUser);
export default router;
