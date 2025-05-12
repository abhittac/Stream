import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Utility function to set HTTP-only cookies
 */
const setCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    throw new ApiError(
      "All fields (username, email, password) are required",
      400
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  // Validate uploaded files
  if (!req.files || !req.files.avatar || !req.files.coverImage) {
    throw new ApiError("Avatar and cover image are required", 400);
  }

  // Upload avatar and coverImage to Cloudinary
  const avatarResult = await uploadToCloudinary(req.files.avatar[0].path, {
    folder: "avatars",
  });
  const coverImageResult = await uploadToCloudinary(
    req.files.coverImage[0].path,
    {
      folder: "coverImages",
    }
  );

  // Create a new user using User.create()
  const newUser = await User.create({
    username,
    email,
    password,
    avatar: avatarResult.secure_url,
    coverImage: coverImageResult.secure_url,
  });

  // Send success response
  const response = new ApiResponse(201, "User registered successfully", {
    user: newUser,
  });
  return res.status(response.statusCode).json(response);
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  // Verify password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError("Invalid email or password", 401);
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save the refresh token in the database
  user.refreshToken = refreshToken;
  await user.save();

  // Set tokens as HTTP-only cookies
  setCookies(res, accessToken, refreshToken);

  // Send success response without tokens in the body
  const response = new ApiResponse(200, "Login successful", {
    message: "Tokens are set in cookies",
  });
  return res.status(response.statusCode).json(response);
});
export const refreshTokenController = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies; // Get the refresh token from cookies

  // Validate the presence of the refresh token
  if (!refreshToken) {
    throw new ApiError("Refresh token is required", 400);
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the refresh token exists in the database
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError("Invalid refresh token", 401);
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Save the new refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set tokens as HTTP-only cookies
    setCookies(res, newAccessToken, newRefreshToken);

    // Send success response
    const response = new ApiResponse(200, "Tokens refreshed successfully", {
      message: "New tokens are set in cookies",
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError("Invalid or expired refresh token", 403);
  }
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    throw new ApiError("Current password and new password are required", 400);
  }

  // Get the authenticated user
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // Verify the current password
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError("Current password is incorrect", 401);
  }

  // Update the password
  user.password = newPassword;
  await user.save();

  // Send success response
  const response = new ApiResponse(200, "Password updated successfully");
  return res.status(response.statusCode).json(response);
});
export const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  // Validate the presence of the refresh token
  if (!refreshToken) {
    throw new ApiError("Refresh token is required to log out", 400);
  }

  // Find the user by refresh token
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new ApiError("Invalid refresh token", 401);
  }

  // Clear the refresh token in the database
  user.refreshToken = null;
  await user.save();

  // Clear cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Send success response
  const response = new ApiResponse(200, "Logged out successfully");
  return res.status(response.statusCode).json(response);
});
