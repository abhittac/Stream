import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - The path of the file to upload
 * @param {object} options - Additional options for the upload
 * @returns {Promise<object>} - The uploaded file's details
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, options);
    fs.unlinkSync(filePath); // Deletes the file after successful upload
    return result;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Deletes the file if the upload fails
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export { cloudinary };
