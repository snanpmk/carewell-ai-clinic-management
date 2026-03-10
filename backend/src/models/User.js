const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Optional, as users logging in with Google may not have a password
    },
    profileImage: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["primary", "doctor"],
      default: "doctor",
    },
    googleId: {
      type: String,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
