const ChronicCase = require("../models/ChronicCase");
const Patient = require("../models/Patient");

/**
 * @desc    Create a new chronic case
 * @route   POST /api/chronicCases
 * @access  Private
 */
const createChronicCase = async (req, res) => {
  try {
    const { patient } = req.body;

    // Verify patient exists and belongs to clinic
    const existingPatient = await Patient.findOne({ _id: patient, clinic: req.clinicId });
    if (!existingPatient) {
      return res.status(404).json({ success: false, error: "Patient not found in your clinic" });
    }

    const newCase = new ChronicCase({
      ...req.body,
      doctor: req.user._id,
      clinic: req.clinicId,
    });

    const savedCase = await newCase.save();

    // Update patient's existing conditions if provided
    if (req.body.diseaseAnalysis?.provisionalDiagnosis) {
      await Patient.findByIdAndUpdate(patient, {
        $set: { existingConditions: req.body.diseaseAnalysis.provisionalDiagnosis }
      });
    } else if (req.body.summaryDiagnosis?.diseaseDiagnosis) {
      await Patient.findByIdAndUpdate(patient, {
        $set: { existingConditions: req.body.summaryDiagnosis.diseaseDiagnosis }
      });
    }

    res.status(201).json({ success: true, data: savedCase });
  } catch (error) {
    console.error("Error creating chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to create chronic case" });
  }
};

/**
 * @desc    Get a single chronic case by ID
 * @route   GET /api/chronicCases/:id
 * @access  Private
 */
const getChronicCase = async (req, res) => {
  try {
    const chronicCase = await ChronicCase.findOne({ _id: req.params.id, clinic: req.clinicId })
      .populate("patient", "name age gender contact")
      .populate("doctor", "name profileImage licenseNumber");
    if (!chronicCase) {
      return res.status(404).json({ success: false, error: "Chronic case not found in your clinic" });
    }
    res.json({ success: true, data: chronicCase });
  } catch (error) {
    console.error("Error fetching chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to fetch chronic case" });
  }
};

/**
 * @desc    Get all chronic cases for a specific patient
 * @route   GET /api/chronicCases/patient/:patientId
 * @access  Private
 */
const getPatientChronicCases = async (req, res) => {
  try {
    const cases = await ChronicCase.find({ patient: req.params.patientId, clinic: req.clinicId })
      .populate("doctor", "name profileImage")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: cases });
  } catch (error) {
    console.error("Error fetching chronic cases for patient:", error);
    res.status(500).json({ success: false, error: "Failed to fetch chronic cases" });
  }
};

/**
 * @desc    Update a chronic case
 * @route   PUT /api/chronicCases/:id
 * @access  Private
 */
const updateChronicCase = async (req, res) => {
  try {
    const updatedCase = await ChronicCase.findOneAndUpdate(
      { _id: req.params.id, clinic: req.clinicId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, error: "Chronic case not found in your clinic" });
    }

    res.json({ success: true, data: updatedCase });
  } catch (error) {
    console.error("Error updating chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to update chronic case" });
  }
};

/**
 * @desc    Add a follow-up entry to a chronic case
 * @route   POST /api/chronicCases/:id/followup
 * @access  Private
 */
const addFollowUp = async (req, res) => {
  try {
    const { date, symptomChanges, interference, prescription } = req.body;
    const updatedCase = await ChronicCase.findOneAndUpdate(
      { _id: req.params.id, clinic: req.clinicId },
      {
        $push: {
          followUps: { date: date || new Date(), symptomChanges, interference, prescription },
        },
      },
      { new: true }
    );
    if (!updatedCase) {
      return res.status(404).json({ success: false, error: "Chronic case not found in your clinic" });
    }
    res.json({ success: true, data: updatedCase });
  } catch (error) {
    console.error("Error adding follow-up:", error);
    res.status(500).json({ success: false, error: "Failed to add follow-up" });
  }
};

/**
 * @desc    Delete a chronic case
 * @route   DELETE /api/chronicCases/:id
 * @access  Private
 */
const deleteChronicCase = async (req, res) => {
  try {
    const deletedCase = await ChronicCase.findOneAndDelete({ _id: req.params.id, clinic: req.clinicId });
    if (!deletedCase) {
      return res.status(404).json({ success: false, error: "Chronic case not found in your clinic" });
    }
    res.json({ success: true, message: "Chronic case deleted" });
  } catch (error) {
    console.error("Error deleting chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to delete chronic case" });
  }
};

module.exports = {
  createChronicCase,
  getChronicCase,
  getPatientChronicCases,
  updateChronicCase,
  deleteChronicCase,
  addFollowUp,
};
