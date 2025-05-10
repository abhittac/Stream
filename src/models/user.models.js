import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/dqj0xg3zv/image/upload/v1698236482/avatars/default-avatar.png",
    },
    coverImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dqj0xg3zv/image/upload/v1698236482/avatars/default-cover.png",
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Add this pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Skip hashing if the password is not modified
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// Add an instance method to check if the password is correct
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the hashed password
  } catch (error) {
    throw new Error("Error while comparing passwords");
  }
};

// Add an instance method to generate an access token
userSchema.methods.generateAccessToken = function () {
  try {
    const accessToken = jwt.sign(
      { id: this._id, email: this.email }, // Payload
      process.env.ACCESS_TOKEN_SECRET, // Secret key
      { expiresIn: "15m" } // Token expiration time
    );
    return accessToken;
  } catch (error) {
    throw new Error("Error while generating access token");
  }
};

// Add an instance method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
  try {
    const refreshToken = jwt.sign(
      { id: this._id, email: this.email }, // Payload
      process.env.REFRESH_TOKEN_SECRET, // Secret key
      { expiresIn: "7d" } // Token expiration time
    );
    this.refreshToken = refreshToken; // Save the refresh token in the database
    return refreshToken;
  } catch (error) {
    throw new Error("Error while generating refresh token");
  }
};

export const User = mongoose.model("User", userSchema);
