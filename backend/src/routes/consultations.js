const express = require("express");
const router = express.Router();
const {
  saveConsultation,
  getConsultationsByPatient,
  getAllConsultations,
} = require("../controllers/consultationController");
const { protect } = require("../middleware/auth");

// POST /api/consultations – save a consultation record
router.post("/", protect, saveConsultation);

// GET /api/consultations/all – get all recent consultations
router.get("/all", protect, getAllConsultations);

// GET /api/consultations/:patientId – get all consultations for a patient
router.get("/:patientId", protect, getConsultationsByPatient);

module.exports = router;

