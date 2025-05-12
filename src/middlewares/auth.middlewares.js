import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to verify the access token
 */
export const authenticateToken = asyncHandler(async (req, res, next) => {
  // Get the token from cookies or Authorization header
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  // Check if the token is provided
  if (!token) {
    throw new ApiError("Access token is missing", 401);
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    throw new ApiError("Invalid or expired access token", 403);
  }
});
