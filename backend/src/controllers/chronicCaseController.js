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

    // Verify patient exists
    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }

    const newCase = new ChronicCase({
      ...req.body,
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
    const chronicCase = await ChronicCase.findById(req.params.id).populate("patient", "name age gender contact");
    if (!chronicCase) {
      return res.status(404).json({ success: false, error: "Chronic case not found" });
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
    const cases = await ChronicCase.find({ patient: req.params.patientId }).sort({ createdAt: -1 });
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
    const updatedCase = await ChronicCase.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, error: "Chronic case not found" });
    }

    res.json({ success: true, data: updatedCase });
  } catch (error) {
    console.error("Error updating chronic case:", error);
    res.status(500).json({ success: false, error: "Failed to update chronic case" });
  }
};

/**
 * @desc    Delete a chronic case
 * @route   DELETE /api/chronicCases/:id
 * @access  Private
 */
const deleteChronicCase = async (req, res) => {
  try {
    const deletedCase = await ChronicCase.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ success: false, error: "Chronic case not found" });
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
};
