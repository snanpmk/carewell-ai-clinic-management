const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Clinic = require("./src/models/Clinic");
const User = require("./src/models/User");
const Patient = require("./src/models/Patient");
const Consultation = require("./src/models/Consultation");
const ChronicCase = require("./src/models/ChronicCase");
const AICache = require("./src/models/AICache");
const dbConfig = require("./src/config/db");

const wipeAndSeed = async () => {
  try {
    await dbConfig();
    console.log("Connected to database...");

    const clinic = await Clinic.findOne();
    const doctor = await User.findOne({ role: "primary" });

    if (!clinic || !doctor) {
      console.error("Clinic or Primary Doctor not found. Cannot seed data without a registered clinic.");
      process.exit(1);
    }

    console.log(`Targeting Clinic: ${clinic.name}, Doctor: ${doctor.name}`);

    // 1. WIPE DATA (Clinical records only, keep Clinic/User)
    console.log("Wiping existing clinical records...");
    await Patient.deleteMany({});
    await Consultation.deleteMany({});
    await ChronicCase.deleteMany({});
    await AICache.deleteMany({});
    console.log("Wipe complete.");

    // 2. SEED PATIENTS
    console.log("Seeding fresh patient data...");
    const patientsData = [
      { 
        name: "Alice Johnson", 
        age: 34, 
        gender: "Female", 
        phone: "9876543210", 
        email: "alice@example.com", 
        address: "123 Green Valley, Bangalore",
        clinic: clinic._id 
      },
      { 
        name: "Bob Smith", 
        age: 45, 
        gender: "Male", 
        phone: "9876543211", 
        email: "bob@example.com", 
        address: "45-B North Sector, Kochi",
        clinic: clinic._id 
      },
      { 
        name: "Charlie Davis", 
        age: 28, 
        gender: "Other", 
        phone: "9876543212", 
        address: "Skyline Apartments, Delhi",
        clinic: clinic._id 
      },
    ];

    const patients = await Patient.insertMany(patientsData);
    console.log(`Seeded ${patients.length} patients.`);

    // 3. SEED CHRONIC CASE (For Alice)
    console.log("Initializing Master Chronic Record for Alice...");
    const aliceChronic = new ChronicCase({
      patient: patients[0]._id,
      doctor: doctor._id,
      clinic: clinic._id,
      status: "Active",
      header: { opNumber: "OP-2026-001", date: new Date() },
      demographics: { 
        name: "Alice Johnson", 
        age: 34, 
        sex: "Female",
        phone: "9876543210",
        address: "123 Green Valley, Bangalore"
      },
      summaryDiagnosis: { diseaseDiagnosis: "Chronic Migraine with Aura" },
      physicalFeatures: {
        constitution: {
          thermal: "Hot",
          temperament: "Choleric"
        }
      },
      analysisAndDiagnosis: {
         finalDiagnosis: { 
           miasmDominance: "Psora-Sycosis",
           homeopathicDiagnosis: "Natrum Mur"
         },
         evaluation: { totalityOfSymptoms: "Right sided migraine, worse from sun exposure, craves salt, reserved personality." }
      },
      management: {
        plan: "Constitutional treatment with dietary adjustments (reduce direct salt)",
        firstPrescription: {
          basis: "Totality of symptoms and constitutional match",
          medicines: [
            {
              medicine: "Natrum Mur",
              potency: "200c",
              form: "Pills",
              dose: "4 pills OD",
              quantity: "1 month supply",
              indication: "Constitutional remedy for migraine"
            }
          ]
        }
      },
      physicalExamination: {
        vitals: {
          bp: "120/80",
          weight: "65",
          height: "165",
          pulse: "72"
        }
      },
      followUps: [
        {
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          symptomChanges: "Intensity of headache reduced by 40%. Sleep improved.",
          prescription: "Continue Natrum Mur 200c"
        }
      ]
    });
    await aliceChronic.save();
    console.log("Seeded Master Chronic Record.");

    // 4. SEED CONSULTATIONS (Past & Future)
    console.log("Seeding interaction feed...");
    const consultations = [
      {
        patientId: patients[0]._id,
        doctorId: doctor._id,
        clinic: clinic._id,
        opNumber: "OP-2026-002",
        symptoms: "Mild fever and sore throat since yesterday",
        diagnosis: "Acute Pharyngitis",
        prescription: "Belladonna 30c (Liquid) - 5 drops TDS",
        status: "Completed",
        consultationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        patientId: patients[1]._id,
        doctorId: doctor._id,
        clinic: clinic._id,
        opNumber: "OP-2026-003",
        symptoms: "Acute gastric pain after heavy dinner",
        diagnosis: "Dyspepsia",
        prescription: "Nux Vomica 30c (Pills) - 4 pills HS",
        status: "Completed",
        consultationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        patientId: patients[2]._id,
        doctorId: doctor._id,
        clinic: clinic._id,
        opNumber: "OP-2026-004",
        symptoms: "Initial screening - Anxiety and sleep issues",
        status: "Scheduled",
        consultationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      }
    ];

    await Consultation.insertMany(consultations);
    console.log("Seeded interaction feed.");

    console.log("SUCCESS: Database has been wiped and re-seeded with professional data.");
    process.exit(0);
  } catch (error) {
    console.error("Operation failed:", error);
    process.exit(1);
  }
};

wipeAndSeed();
