const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");

router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file provided" });
    }
    
    // Cloudinary returns the secure URL of the uploaded image
    const imageUrl = req.file.path;
    res.status(200).json({ success: true, url: imageUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, error: "Server error during image upload" });
  }
});

module.exports = router;
