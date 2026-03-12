const express = require("express");
const router = express.Router();
const { generateNotes, summarizeHistory, analyzeChronicCaseController, getNextOPNumber } = require("../controllers/generateController");
const { protect } = require("../middleware/auth");

// GET /api/ai/next-op-number - Generate next available OP number
router.get("/next-op-number", protect, getNextOPNumber);

// POST /api/ai/generate-notes – generate AI consultation notes
router.post("/generate-notes", protect, generateNotes);

// POST /api/ai/summarize-history - generate AI summary of patient history
router.post("/summarize-history", protect, summarizeHistory);

// POST /api/ai/analyze-chronic-case - Analyze a chronic case
router.post("/analyze-chronic-case", protect, analyzeChronicCaseController);

module.exports = router;
