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

module.exports = { cloudinary, upload };
