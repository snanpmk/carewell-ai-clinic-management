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
      opNumber,
      status,
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
      aiGeneratedNotes: typeof aiGeneratedNotes === "string" ? aiGeneratedNotes : JSON.stringify(aiGeneratedNotes),
      doctorEditedNotes: typeof doctorEditedNotes === "string" ? doctorEditedNotes : JSON.stringify(doctorEditedNotes),
      opNumber,
      status: status || "Completed",
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

/**
 * PUT /api/consultations/:id
 * Update an existing consultation record.
 */
const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.aiGeneratedNotes && typeof updateData.aiGeneratedNotes !== "string") {
      updateData.aiGeneratedNotes = JSON.stringify(updateData.aiGeneratedNotes);
    }
    if (updateData.doctorEditedNotes && typeof updateData.doctorEditedNotes !== "string") {
      updateData.doctorEditedNotes = JSON.stringify(updateData.doctorEditedNotes);
    }

    const consultation = await Consultation.findByIdAndUpdate(id, updateData, { new: true });

    if (!consultation) {
      return res.status(404).json({ success: false, error: "Consultation not found." });
    }

    return res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    console.error("updateConsultation error:", error.message);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

/**
 * GET /api/consultations/single/:id
 * Fetch a single consultation record by ID.
 */
const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate("patientId", "name age phone gender")
      .select("-__v");

    if (!consultation) {
      return res.status(404).json({ success: false, error: "Consultation not found." });
    }

    return res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    console.error("getConsultationById error:", error.message);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

module.exports = { saveConsultation, getConsultationsByPatient, getAllConsultations, updateConsultation, getConsultationById };
