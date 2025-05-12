import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const registerUser = async (req, res, next) => {
  try {
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
      { folder: "coverImages" }
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
  } catch (error) {
    next(error);
  }
};
export const loginUser = async (req, res, next) => {
  try {
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
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Ensures cookies are sent over HTTPS in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send success response without tokens in the body
    const response = new ApiResponse(200, "Login successful", {
      message: "Tokens are set in cookies",
      refreshToken,
      accessToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
