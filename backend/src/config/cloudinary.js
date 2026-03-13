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
  params: async (req, file) => {
    // Get folder type from query param or body, default to 'misc'
    const type = req.query.type || req.body.type || "misc";
    
    // Define allowed folders to prevent arbitrary folder creation
    const allowedFolders = ["users", "patients", "clinical", "misc"];
    const folderName = allowedFolders.includes(type) ? `carewell/${type}` : "carewell/misc";

    return {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: type === "users" || type === "patients" 
        ? [{ width: 500, height: 500, crop: "fill" }] // Auto-crop profile pictures
        : [], // Keep clinical images original
    };
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
