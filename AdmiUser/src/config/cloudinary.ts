import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.API_KEY!,
  api_secret: process.env.API_SECRET!,
});

const SIZE_LIMIT = 2 * 1024 * 1024; // 2MB Limit

// Upload multiple images to Cloudinary
const uploadMultipleImagesOnCloudinary = async (localFilePaths: string[]) => {
  try {
    const uploadResults = await Promise.all(
      localFilePaths.map(async (filePath) => {
        try {
          // Validate file size
          const stats = fs.statSync(filePath);
          if (stats.size > SIZE_LIMIT) {
            return {
              error: `File ${filePath} exceeds the allowed limit of 2MB. Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
              status: 400,
            };
          }

          // Upload to Cloudinary
          const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "image",
          });

          return response;
        } catch (error: any) {
          return {
            error: error.message || `Failed to upload ${filePath} to Cloudinary.`,
            status: 500,
          };
        } finally {
          // Clean up local file
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      })
    );

    return uploadResults;
  } catch (error: any) {
    console.error("Error uploading images:", error);
    return { error: "Failed to upload images.", status: 500 };
  }
};

export default uploadMultipleImagesOnCloudinary;
