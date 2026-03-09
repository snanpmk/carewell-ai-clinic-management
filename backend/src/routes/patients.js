const express = require("express");
const router = express.Router();
const { registerPatient, getPatient, getAllPatients } = require("../controllers/patientController");

// POST /api/patients – register new patient
router.post("/", registerPatient);

// GET /api/patients - fetch all patients
router.get("/", getAllPatients);

// GET /api/patients/:id – fetch patient by ID
router.get("/:id", getPatient);

module.exports = router;
