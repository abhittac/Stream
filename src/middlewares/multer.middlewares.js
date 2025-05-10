import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Replicate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure temp directory exists
const tempDir = path.join(__dirname, "../public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Define storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "");
    const ext = path.extname(sanitizedName) || "";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// Initialize multer with storage + security filter
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type!"), false);
    }
  },
});

export default upload;
