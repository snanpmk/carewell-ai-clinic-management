const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const multer = require("multer");

// Middleware to handle Multer upload and catch errors specifically
const handleUpload = (req, res, next) => {
  const uploadMiddleware = upload.single("image");

  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error("Multer Error:", err);
      return res.status(400).json({ 
        success: false, 
        error: `Upload error: ${err.message}` 
      });
    } else if (err) {
      // An unknown error occurred when uploading (like Cloudinary config issues).
      console.error("Cloudinary/Upload Error:", err);
      
      let errorMessage = "Failed to upload image to cloud storage.";
      if (err.http_code === 401) {
        errorMessage = "Cloudinary Authentication failed. Please check if your API Key and Secret are correct in the .env file.";
      } else if (err.http_code === 403) {
        errorMessage = "Cloudinary Access Denied. Please check your cloud name and permissions.";
      }

      return res.status(err.http_code || 500).json({ 
        success: false, 
        error: errorMessage
      });
    }
    // Everything went fine.
    next();
  });
};

router.post("/", handleUpload, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file provided" });
    }
    
    // Cloudinary returns the secure URL of the uploaded image
    const imageUrl = req.file.path;
    res.status(200).json({ success: true, url: imageUrl });
  } catch (error) {
    console.error("Upload Success Handler Error:", error);
    res.status(500).json({ success: false, error: "Server error during image processing" });
  }
});

module.exports = router;
