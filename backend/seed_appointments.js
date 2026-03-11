require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Patient = require("./src/models/Patient");
const Consultation = require("./src/models/Consultation");

const seedAppointments = async () => {
  try {
    await connectDB();

    console.log("Fetching existing patients...");
    const patients = await Patient.find().limit(5);
    
    if (patients.length === 0) {
      console.log("No patients found. Please run 'node seed.js' first.");
      process.exit(1);
    }

    console.log("Seeding appointments for today...");
    
    const today = new Date();
    
    const appointments = [
      {
        patientId: patients[0]._id,
        opNumber: "OP-2026-101",
        symptoms: "Follow-up for chronic knee pain",
        status: "Scheduled",
        consultationDate: new Date(today.setHours(9, 30, 0, 0)),
        aiGeneratedNotes: JSON.stringify({ chiefComplaint: "", assessment: "", advice: "" }),
        doctorEditedNotes: JSON.stringify({ chiefComplaint: "", assessment: "", advice: "" })
      },
      {
        patientId: patients[1]._id,
        opNumber: "OP-2026-102",
        symptoms: "Acute gastric distress and acidity",
        status: "Scheduled",
        consultationDate: new Date(today.setHours(11, 0, 0, 0)),
        aiGeneratedNotes: JSON.stringify({ chiefComplaint: "", assessment: "", advice: "" }),
        doctorEditedNotes: JSON.stringify({ chiefComplaint: "", assessment: "", advice: "" })
      },
      {
        patientId: patients[2]._id,
        opNumber: "OP-2026-103",
        symptoms: "Pediatric checkup - mild fever",
        status: "Scheduled",
        consultationDate: new Date(today.setHours(14, 15, 0, 0)),
        aiGeneratedNotes: JSON.stringify({ chiefComplaint: "", assessment: "", advice: "" }),
        doctorEditedNotes: JSON.stringify({ chiefComplaint: "", assessment: "", advice: "" })
      },
      {
        patientId: patients[3]._id,
        opNumber: "OP-2026-104",
        symptoms: "Allergic rhinitis management",
        status: "Scheduled",
        consultationDate: new Date(today.setHours(16, 45, 0, 0)),
        aiGeneratedNotes: JSON.stringify({ chiefComplaint: "", assessment: "", advice: "" }),
        doctorEditedNotes: JSON.stringify({ chiefComplaint: "", assessment: "", advice: "" })
      }
    ];

    await Consultation.insertMany(appointments);

    console.log(`✅ Successfully seeded ${appointments.length} appointments for today.`);
    process.exit();
  } catch (error) {
    console.error("Error seeding appointments:", error.message);
    process.exit(1);
  }
};

seedAppointments();
