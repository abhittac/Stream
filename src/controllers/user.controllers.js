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
