const Consultation = require("../models/Consultation");

/**
 * POST /api/consultations
 * Save a completed consultation record.
 */
const saveConsultation = async (req, res) => {
  try {
    const {
      patientId,
      symptoms,
      modalities,
      generals,
      mentals,
      diagnosis,
      prescription,
      additionalNotes,
      aiGeneratedNotes,
      doctorEditedNotes,
    } = req.body;

    const consultation = await Consultation.create({
      patientId,
      symptoms,
      modalities,
      generals,
      mentals,
      diagnosis,
      prescription,
      additionalNotes,
      aiGeneratedNotes: JSON.stringify(aiGeneratedNotes),
      doctorEditedNotes: JSON.stringify(doctorEditedNotes),
    });

    return res.status(201).json({
      success: true,
      data: { consultationId: consultation._id },
    });
  } catch (error) {
    console.error("saveConsultation error:", error.message);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

/**
 * GET /api/consultations/:patientId
 * Fetch all consultations for a given patient.
 */
const getConsultationsByPatient = async (req, res) => {
  try {
    const consultations = await Consultation.find({
      patientId: req.params.patientId,
    })
      .sort({ consultationDate: -1 })
      .select("-__v");

    return res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    console.error("getConsultationsByPatient error:", error.message);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

/**
 * GET /api/consultations
 * Fetch all recent consultations across all patients.
 */
const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate("patientId", "name age phone")
      .sort({ consultationDate: -1 })
      .select("-__v");

    return res.status(200).json({ success: true, data: consultations });
  } catch (error) {
    console.error("getAllConsultations error:", error.message);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

module.exports = { saveConsultation, getConsultationsByPatient, getAllConsultations };
