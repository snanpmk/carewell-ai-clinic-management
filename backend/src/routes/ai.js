const express = require("express");
const router = express.Router();
const { generateNotes, summarizeHistory } = require("../controllers/generateController");

// POST /api/ai/generate-notes – generate AI consultation notes
router.post("/generate-notes", generateNotes);

// POST /api/ai/summarize-history - generate AI summary of patient history
router.post("/summarize-history", summarizeHistory);

module.exports = router;
