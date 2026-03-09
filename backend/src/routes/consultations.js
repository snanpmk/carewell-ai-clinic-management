const express = require("express");
const router = express.Router();
const {
  saveConsultation,
  getConsultationsByPatient,
  getAllConsultations,
} = require("../controllers/consultationController");

// POST /api/consultations – save a consultation record
router.post("/", saveConsultation);

// GET /api/consultations/all – get all recent consultations
router.get("/all", getAllConsultations);

// GET /api/consultations/:patientId – get all consultations for a patient
router.get("/:patientId", getConsultationsByPatient);

module.exports = router;
