import multer from "multer";
import path from "path";
import fs from "fs";

// Define upload directory
const uploadDir = path.join(__dirname, "../imageUploads/assets");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for images only
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

// Multer upload instance for multiple images (Max: 5 files)
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per file
});
