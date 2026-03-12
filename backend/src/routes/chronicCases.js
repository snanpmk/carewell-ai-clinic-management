const express = require("express");
const router = express.Router();
const {
  createChronicCase,
  getChronicCase,
  getPatientChronicCases,
  updateChronicCase,
  deleteChronicCase,
  addFollowUp,
} = require("../controllers/chronicCaseController");
const { protect } = require("../middleware/auth");

// @route   POST /api/chronicCases
router.post("/", protect, createChronicCase);

// @route   GET /api/chronicCases/:id
router.get("/:id", protect, getChronicCase);

// @route   GET /api/chronicCases/patient/:patientId
router.get("/patient/:patientId", protect, getPatientChronicCases);

// @route   PUT /api/chronicCases/:id
router.put("/:id", protect, updateChronicCase);

// @route   POST /api/chronicCases/:id/followup
router.post("/:id/followup", protect, addFollowUp);

// @route   DELETE /api/chronicCases/:id
router.delete("/:id", protect, deleteChronicCase);

module.exports = router;
