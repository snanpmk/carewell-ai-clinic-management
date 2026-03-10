const express = require("express");
const router = express.Router();
const { registerPatient, getPatient, getAllPatients } = require("../controllers/patientController");
const { protect } = require("../middleware/auth");

// POST /api/patients – register new patient
router.post("/", protect, registerPatient);

// GET /api/patients - fetch all patients
router.get("/", protect, getAllPatients);

// GET /api/patients/:id – fetch patient by ID
router.get("/:id", protect, getPatient);

module.exports = router;

