const express = require("express");
const router = express.Router();
const ChronicCase = require("../models/ChronicCase");
const Patient = require("../models/Patient");
const { protect } = require("../middlewares/authMiddleware");

// @route   POST /api/chronicCases
// @desc    Create a new chronic case
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { patient } = req.body;

    // Verify patient exists
    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const newCase = new ChronicCase({
      ...req.body,
    });

    const savedCase = await newCase.save();

    // Optionally update patient's most recent consultation/case
    // depending on system requirements

    res.status(201).json({ success: true, data: savedCase });
  } catch (error) {
    console.error("Error creating chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to create chronic case" });
  }
});

// @route   GET /api/chronicCases/:id
// @desc    Get a single chronic case by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const chronicCase = await ChronicCase.findById(req.params.id).populate("patient", "name age gender contact");
    if (!chronicCase) {
      return res.status(404).json({ error: "Chronic case not found" });
    }
    res.json({ success: true, data: chronicCase });
  } catch (error) {
    console.error("Error fetching chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to fetch chronic case" });
  }
});

// @route   GET /api/chronicCases/patient/:patientId
// @desc    Get all chronic cases for a specific patient
// @access  Private
router.get("/patient/:patientId", protect, async (req, res) => {
  try {
    const cases = await ChronicCase.find({ patient: req.params.patientId }).sort({ createdAt: -1 });
    res.json({ success: true, data: cases });
  } catch (error) {
    console.error("Error fetching chronic cases for patient:", error);
    res.status(500).json({ success: false, error: "Failed to fetch chronic cases" });
  }
});

// @route   PUT /api/chronicCases/:id
// @desc    Update a chronic case
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedCase = await ChronicCase.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Chronic case not found" });
    }

    res.json({ success: true, data: updatedCase });
  } catch (error) {
    console.error("Error updating chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to update chronic case" });
  }
});

// @route   DELETE /api/chronicCases/:id
// @desc    Delete a chronic case
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedCase = await ChronicCase.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ error: "Chronic case not found" });
    }
    res.json({ success: true, message: "Chronic case deleted" });
  } catch (error) {
    console.error("Error deleting chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to delete chronic case" });
  }
});

module.exports = router;
