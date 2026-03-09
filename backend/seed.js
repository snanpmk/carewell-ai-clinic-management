require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Patient = require("./src/models/Patient");
const Consultation = require("./src/models/Consultation");

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Patient.deleteMany();
    await Consultation.deleteMany();

    console.log("Seeding patients...");
    const patients = await Patient.insertMany([
      { name: "Ahmed", age: 32, gender: "Male", phone: "555-0123", email: "ahmed@example.com", address: "Downtown Dubai", existingConditions: "None" },
      { name: "Fatima", age: 45, gender: "Female", phone: "555-0199", email: "fatima@example.com", address: "Marina", existingConditions: "Asthma" },
      { name: "Rahman", age: 29, gender: "Male", phone: "555-0824", email: "rahman@example.com", address: "Business Bay", existingConditions: "None" },
      { name: "Sara", age: 52, gender: "Female", phone: "555-0345", email: "sara@example.com", address: "Jumeirah", existingConditions: "Hypertension" },
      { name: "Omar", age: 38, gender: "Male", phone: "555-0901", email: "omar@example.com", address: "Deira", existingConditions: "None" },
    ]);

    console.log("Seeding consultations...");
    // Let's create past consultations for Ahmed and others
    const date1 = new Date();
    date1.setDate(date1.getDate() - 20); // 20 days ago

    const date2 = new Date();
    date2.setDate(date2.getDate() - 2); // 2 days ago

    await Consultation.insertMany([
      {
        patientId: patients[0]._id, // Ahmed
        symptoms: "Severe headache on left side, worse in morning",
        duration: "3 days",
        severity: "severe",
        additionalNotes: "Nausea present",
        doctorEditedNotes: "Belladonna 30c",
        consultationDate: date1,
        aiGeneratedNotes: JSON.stringify({
          chiefComplaint: "Patient complains of severe left-sided headache, worse in the morning, accompanied by nausea for 3 days.",
          assessment: "Likely a migraine or tension-type headache based on severity and morning aggravation.",
          advice: "Prescribed Belladonna 30c. Rest in a dark, quiet room. Stay hydrated."
        })
      },
      {
        patientId: patients[0]._id, // Ahmed
        symptoms: "Headache with nasal congestion",
        duration: "2 days",
        severity: "moderate",
        additionalNotes: "",
        doctorEditedNotes: "Nat Mur 200c",
        consultationDate: date2,
        aiGeneratedNotes: JSON.stringify({
          chiefComplaint: "Patient reports moderate headache accompanied by nasal congestion for the past 2 days.",
          assessment: "Possible sinus headache or common cold.",
          advice: "Prescribed Nat Mur 200c. Inhale steam. Rest."
        })
      },
      {
        patientId: patients[1]._id, // Fatima
        symptoms: "Slight fever, running nose, coughing",
        duration: "4 days",
        severity: "moderate",
        additionalNotes: "Cough is dry",
        doctorEditedNotes: "Bryonia 30c",
        consultationDate: date2,
        aiGeneratedNotes: JSON.stringify({
          chiefComplaint: "Patient presents with a 4-day history of slight fever, runny nose, and dry cough.",
          assessment: "Upper respiratory tract infection or common cold.",
          advice: "Prescribed Bryonia 30c. Drink warm fluids and rest."
        })
      }
    ]);

    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error.message);
    process.exit(1);
  }
};

seedData();
