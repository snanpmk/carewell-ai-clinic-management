const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Consultation = require("./src/models/Consultation");
const ChronicCase = require("./src/models/ChronicCase");
const User = require("./src/models/User");
const dbConfig = require("./src/config/db");

const migrate = async () => {
  try {
    await dbConfig();
    console.log("Connected to database...");

    // Find the primary doctor or the first doctor
    const primaryDoctor = await User.findOne({ role: "primary" }) || await User.findOne({ role: "doctor" });

    if (!primaryDoctor) {
      console.error("No doctor found in the database to link cases to.");
      process.exit(1);
    }

    console.log(`Using Doctor: ${primaryDoctor.name} (${primaryDoctor._id}) for migration.`);

    // Update Consultations
    const consultationResult = await Consultation.updateMany(
      { doctorId: { $exists: false } },
      { $set: { doctorId: primaryDoctor._id } }
    );
    console.log(`Updated ${consultationResult.modifiedCount} consultations.`);

    // Update Chronic Cases
    const chronicResult = await ChronicCase.updateMany(
      { doctor: { $exists: false } },
      { $set: { doctor: primaryDoctor._id } }
    );
    console.log(`Updated ${chronicResult.modifiedCount} chronic cases.`);

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
