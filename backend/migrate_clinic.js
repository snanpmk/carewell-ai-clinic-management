const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Consultation = require("./src/models/Consultation");
const ChronicCase = require("./src/models/ChronicCase");
const Patient = require("./src/models/Patient");
const Clinic = require("./src/models/Clinic");
const dbConfig = require("./src/config/db");

const migrate = async () => {
  try {
    await dbConfig();
    console.log("Connected to database...");

    // Find the first clinic
    const clinic = await Clinic.findOne();

    if (!clinic) {
      console.error("No clinic found in the database. Run registration first.");
      process.exit(1);
    }

    console.log(`Using Clinic: ${clinic.name} (${clinic._id}) for migration.`);

    // Update Patients
    const patientResult = await Patient.updateMany(
      { clinic: { $exists: false } },
      { $set: { clinic: clinic._id } }
    );
    console.log(`Updated ${patientResult.modifiedCount} patients.`);

    // Update Consultations
    const consultationResult = await Consultation.updateMany(
      { clinic: { $exists: false } },
      { $set: { clinic: clinic._id } }
    );
    console.log(`Updated ${consultationResult.modifiedCount} consultations.`);

    // Update Chronic Cases
    const chronicResult = await ChronicCase.updateMany(
      { clinic: { $exists: false } },
      { $set: { clinic: clinic._id } }
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
