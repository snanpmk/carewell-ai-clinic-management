const express = require("express");
const router = express.Router();
const {
  saveConsultation,
  getConsultationsByPatient,
  getAllConsultations,
  updateConsultation,
  getConsultationById,
} = require("../controllers/consultationController");
const { protect } = require("../middleware/auth");

// POST /api/consultations – save a consultation record
router.post("/", protect, saveConsultation);

// PUT /api/consultations/:id – update a consultation record
router.put("/:id", protect, updateConsultation);

// GET /api/consultations/single/:id – get a single consultation record
router.get("/single/:id", protect, getConsultationById);

// GET /api/consultations/all – get all recent consultations
router.get("/all", protect, getAllConsultations);

// GET /api/consultations/:patientId – get all consultations for a patient
router.get("/:patientId", protect, getConsultationsByPatient);

module.exports = router;

