const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const ChronicCase = require("./src/models/ChronicCase");
const connectDB = require("./src/config/db");

const PATIENT_ID = "69afdbba6efec41a2d9ea84f";

const sampleChronicCase = {
  patient: PATIENT_ID,
  status: "Completed",
  header: {
    opNumber: "2024/CR/772",
    unit: "Unit I",
    caseTakenBy: "Dr. Admin",
  },
  demographics: {
    name: "Sample Patient",
    age: 42,
    sex: "Male",
    religion: "Hindu",
    caste: "General",
    occupation: "Software Engineer",
    address: "123 Green Valley, Bangalore",
    phone: "9876543210",
    maritalStatus: "Married",
  },
  initialPresentation: {
    patientNarration: "I have been suffering from chronic migraine for the past 5 years. The pain usually starts on the right side and feels like a throbbing pressure. It gets worse if I skip meals or stay under the sun for too long.",
    physicianInterpretation: "Chronic right-sided hemicrania with clear gastric triggers.",
    physicianObservation: "Patient appeared anxious, constantly rubbing his right temple. Pupils were slightly dilated.",
  },
  presentingComplaints: [
    {
      complaintType: "Chief",
      location: {
        system: "Nervous System",
        organ: "Head",
        direction: "Right",
        duration: "5 years",
      },
      sensation: "Throbbing, bursting pain",
      modalities: {
        aggravation: "Sun heat, skipped meals, noise",
        amelioration: "Pressure, dark room, cold application",
        equivalent: "Vomiting relieves pain",
      },
      accompaniments: "Nausea, photophobia",
    }
  ],
  historyOfPresentIllness: {
    narrative: "Started after a period of intense work stress. Gradually increased in frequency from once a month to twice a week.",
    onset: "Gradual",
    cause: "Stress and irregular diet",
    progression: "Worsening over 2 years",
  },
  previousIllnessHistory: [
    { age: "12y", event: "Typhoid", treatment: "Allopathic", remarks: "Full recovery" },
    { age: "28y", event: "Sprained Ankle", treatment: "Physiotherapy" }
  ],
  personalHistory: {
    familyStatus: { type: "Nuclear", details: "Wife and 2 children" },
    developmentMilestones: { fontanellaClosure: "Normal", walking: "13 months", talking: "14 months" },
    habitsHobbies: { diet: "Non vegetarian", addictions: ["Coffee", "Tea"], sleep: "6 hours, disturbed" },
    domesticRelations: { family: "Cordial", friends: "Very social" },
  },
  lifeSpaceInvestigation: {
    mentalFeatures: ["Fastidious", "Hasty", "Optimistic", "Sympathetic"],
    emotionalFactors: [
      { factor: "Tension", occasion: "Project deadlines", duration: "Ongoing" }
    ],
    reactionPatterns: [
      { trigger: "Consolation", amelioration: "Feels better when talked to" },
      { trigger: "Music", desire: "Likes soft music" }
    ],
  },
  physicalFeatures: {
    appearance: { build: "Thin", stature: "Small", complexion: "Healthy", cleanliness: "Clean" },
    generals: { appetite: "Good", thirst: "Thirsty for small quantities", sweat: "Profuse on face" },
    constitution: {
      physicalMakeup: "Nitrogenoid",
      temperament: "Choleric",
      thermal: "Hot",
      sideAffinity: "Right",
      tendencies: ["Catch cold", "Perspire"],
    }
  },
  physicalExamination: {
    general: { anemia: "Nil", jaundice: "Nil" },
    vitals: { height: "172", weight: "68", bmi: "23.0", bp: "120/80", pulse: "72" },
  },
  analysisAndDiagnosis: {
    evaluation: { totalityOfSymptoms: "Right sided headache > pressure < sun. Fastidious nature. Thirsty.", miasmaticExpression: ["Psora"] },
    finalDiagnosis: { disease: "Migraine", homeopathicDiagnosis: "Sanguinaria Can" }
  },
  management: {
    plan: "Constitutional management with periodic follow-up.",
    firstPrescription: { basis: "Right sided modalities and thermal state", medicine: "Sanguinaria Can", potency: "200c", dose: "Once daily for 3 days" }
  }
};

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB...");

    // 1. Remove current chronics
    const deleteResult = await ChronicCase.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing chronic cases.`);

    // 2. Load sample
    const newCase = new ChronicCase(sampleChronicCase);
    await newCase.save();
    console.log("Sample chronic case loaded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

run();
