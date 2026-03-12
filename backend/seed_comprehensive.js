const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Clinic = require("./src/models/Clinic");
const User = require("./src/models/User");
const Patient = require("./src/models/Patient");
const Consultation = require("./src/models/Consultation");
const ChronicCase = require("./src/models/ChronicCase");
const dbConfig = require("./src/config/db");

const seed = async () => {
  try {
    await dbConfig();
    console.log("Connected to database...");

    const clinic = await Clinic.findOne();
    const doctor = await User.findOne({ role: "primary" });

    if (!clinic || !doctor) {
      console.error("Clinic or Primary Doctor not found. Please register first.");
      process.exit(1);
    }

    console.log(`Seeding for Clinic: ${clinic.name}, Doctor: ${doctor.name}`);

    // 1. Create Sample Patients
    const patientsData = [
      { name: "Alice Johnson", age: 34, gender: "Female", phone: "9876543210", email: "alice@example.com", clinic: clinic._id },
      { name: "Bob Smith", age: 45, gender: "Male", phone: "9876543211", email: "bob@example.com", clinic: clinic._id },
      { name: "Charlie Davis", age: 28, gender: "Other", phone: "9876543212", clinic: clinic._id },
    ];

    const patients = [];
    for (const pData of patientsData) {
      const p = await Patient.findOneAndUpdate({ phone: pData.phone, clinic: clinic._id }, pData, { upsert: true, new: true });
      patients.push(p);
    }
    console.log(`Seeded ${patients.length} patients.`);

    // 2. Create Past Consultations (Historical Data)
    const pastConsultations = [
      {
        patientId: patients[0]._id,
        doctorId: doctor._id,
        clinic: clinic._id,
        symptoms: "Recurring migraine and light sensitivity",
        diagnosis: "Chronic Migraine",
        prescription: "Belladonna 200c, 4 pills TDS",
        status: "Completed",
        consultationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        opNumber: "OP-2024-H1"
      },
      {
        patientId: patients[1]._id,
        doctorId: doctor._id,
        clinic: clinic._id,
        symptoms: "Acute gastric pain and bloating",
        diagnosis: "Dyspepsia",
        prescription: "Nux Vomica 30c, 4 pills HS",
        status: "Completed",
        consultationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        opNumber: "OP-2024-H2"
      }
    ];

    await Consultation.insertMany(pastConsultations);
    console.log(`Seeded ${pastConsultations.length} past consultations.`);

    // 3. Create Future Appointments (Future Data)
    const futureAppointments = [
      {
        patientId: patients[2]._id,
        doctorId: doctor._id,
        clinic: clinic._id,
        symptoms: "First time visit - General Checkup",
        status: "Scheduled",
        consultationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        opNumber: "APT-2024-F1"
      },
      {
        patientId: patients[0]._id,
        doctorId: doctor._id,
        clinic: clinic._id,
        symptoms: "Migraine follow-up",
        status: "Scheduled",
        consultationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        opNumber: "APT-2024-F2"
      }
    ];

    await Consultation.insertMany(futureAppointments);
    console.log(`Seeded ${futureAppointments.length} future appointments.`);

    // 4. Create a Chronic Case
    const chronicCase = new ChronicCase({
      patient: patients[0]._id,
      doctor: doctor._id,
      clinic: clinic._id,
      status: "Active",
      header: { opNumber: "CH-2024-001", date: new Date() },
      demographics: { name: "Alice Johnson", age: 34, sex: "Female" },
      summaryDiagnosis: { diseaseDiagnosis: "Chronic Migraine" },
      analysisAndDiagnosis: {
         evaluation: { totalityOfSymptoms: "Light sensitivity, right sided pain, worse from sun" },
         finalDiagnosis: { homeopathicDiagnosis: "Belladonna" }
      }
    });
    await chronicCase.save();
    console.log("Seeded 1 chronic case.");

    console.log("Comprehensive seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
