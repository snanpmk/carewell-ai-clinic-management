const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    clinicId: {
      type: String,
      unique: true,
      sparse: true, // For existing clinics
    },
    address: {
      type: String,
      trim: true,
    },
    primaryDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    aiEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clinic", clinicSchema);
