require("dotenv").config();
const connectDB = require("./src/config/db");
const Patient = require("./src/models/Patient");
const Consultation = require("./src/models/Consultation");
const User = require("./src/models/User");
const Clinic = require("./src/models/Clinic");
const AICache = require("./src/models/AICache");

const clearData = async () => {
  try {
    await connectDB();

    console.log("Clearing all collections in the database...");
    
    await Patient.deleteMany({});
    console.log("Patient collection cleared.");
    
    await Consultation.deleteMany({});
    console.log("Consultation collection cleared.");
    
    await User.deleteMany({});
    console.log("User collection cleared.");
    
    await Clinic.deleteMany({});
    console.log("Clinic collection cleared.");
    
    await AICache.deleteMany({});
    console.log("AICache collection cleared.");

    console.log("Database cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing database:", error.message);
    process.exit(1);
  }
};

clearData();
