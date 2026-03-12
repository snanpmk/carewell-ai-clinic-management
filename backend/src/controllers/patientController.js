const Patient = require("../models/Patient");

/**
 * POST /api/patients
 * Register a new patient.
 */
const registerPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, email, address, medicalConditions } = req.body;
    const clinicId = req.clinicId;

    // Check for duplicate phone WITHIN clinic
    if (phone) {
      const existing = await Patient.findOne({ phone: phone, clinic: clinicId });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: "A patient with this phone number already exists in your clinic.",
        });
      }
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
      email: email || undefined,
      address,
      existingConditions: medicalConditions || "",
      clinic: clinicId,
    });

    return res.status(201).json({
      success: true,
      data: { patientId: patient._id, name: patient.name },
    });
  } catch (error) {
    console.error("registerPatient error:", error);
    return res.status(500).json({ success: false, error: error.message || "Server error." });
  }
};

/**
 * GET /api/patients/:id
 * Fetch a patient by their ID.
 */
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, clinic: req.clinicId }).select("-__v");
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, error: "Patient not found in your clinic." });
    }
    return res.status(200).json({ success: true, data: patient });
  } catch (error) {
    console.error("getPatient error:", error.message);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

/**
 * GET /api/patients
 * Fetch all patients for current clinic.
 */
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ clinic: req.clinicId }).sort({ createdAt: -1 }).select("-__v");
    return res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error("getAllPatients error:", error.message);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

module.exports = { registerPatient, getPatient, getAllPatients };
