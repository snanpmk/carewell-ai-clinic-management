const express = require("express");
const router = express.Router();
const { generateNotes, summarizeHistory } = require("../controllers/generateController");
const { protect } = require("../middleware/auth");

// POST /api/ai/generate-notes – generate AI consultation notes
router.post("/generate-notes", protect, generateNotes);

// POST /api/ai/summarize-history - generate AI summary of patient history
router.post("/summarize-history", protect, summarizeHistory);

module.exports = router;
