const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("WARNING: Cloudinary environment variables are missing. Image uploads will fail.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Strictly use query parameters as they are available before the body is parsed
    const type = req.query.type || "misc";
    
    const allowedFolders = ["users", "patients", "clinical", "misc"];
    const folderName = allowedFolders.includes(type) ? `carewell/${type}` : "carewell/misc";

    // Build the configuration object
    const config = {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };

    // Apply transformation only for profile-type images
    if (type === "users" || type === "patients") {
      config.transformation = [{ width: 500, height: 500, crop: "fill", gravity: "face" }];
    }

    return config;
  },
});

const upload = multer({ storage: storage });

/**
 * Utility to delete an image from Cloudinary
 * @param {string} url - The full Cloudinary URL
 */
const deleteImage = async (url) => {
  if (!url || !url.includes("cloudinary.com")) return;

  try {
    // Extract public_id from the URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/filename.jpg
    // We need: folder/filename
    const parts = url.split("/");
    const filenameWithExtension = parts.pop(); // filename.jpg
    const folder = parts.pop(); // folder (e.g., users, patients)
    const publicId = `carewell/${folder}/${filenameWithExtension.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};

module.exports = { cloudinary, upload, deleteImage };
