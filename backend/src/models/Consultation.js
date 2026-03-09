const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
    },
    symptoms: {
      type: String,
      required: [true, "Symptoms are required"],
      trim: true,
    },
    severity: {
      type: String,
      default: "",
    },
    modalities: {
      type: String,
      trim: true,
      default: "",
    },
    generals: {
      type: String,
      trim: true,
      default: "",
    },
    mentals: {
      type: String,
      trim: true,
      default: "",
    },
    diagnosis: {
      type: String,
      trim: true,
      default: "",
    },
    prescription: {
      type: String,
      trim: true,
      default: "",
    },
    additionalNotes: {
      type: String,
      trim: true,
      default: "",
    },
    // Raw AI-generated notes stored as a JSON string (chiefComplaint, assessment, advice)
    aiGeneratedNotes: {
      type: String,
      default: "",
    },
    // Doctor-edited final notes (plain text or JSON string)
    doctorEditedNotes: {
      type: String,
      default: "",
    },
    consultationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);
