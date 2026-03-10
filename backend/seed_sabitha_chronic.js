const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Patient = require("./src/models/Patient");
const ChronicCase = require("./src/models/ChronicCase");
const connectDB = require("./src/config/db");

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB...");

    // 1. Find Patient Sabitha
    let patient = await Patient.findOne({ name: "Sabitha", phone: "9988776655" });
    if (!patient) {
      patient = new Patient({
        name: "Sabitha",
        age: 58,
        gender: "Female",
        phone: "9988776655",
        email: "sabitha@example.com",
        address: "45/B, Rose Villa, Kottayam, Kerala",
        existingConditions: "Thyroid, Knee pain, Varicose, Vision loss"
      });
      await patient.save();
    }

    // Remove existing cases for a clean state
    await ChronicCase.deleteMany({ patient: patient._id });

    // 2. Comprehensive Data Entry (Ref Spec Spec Section by Section)
    const chronicData = {
      patient: patient._id,
      status: "Completed",
      
      // 1. FRONT PAGE / HEADER
      header: {
        opNumber: "2024/CR/1024",
        unit: "Unit II",
        caseTakenBy: "Dr. Carewell",
        clinic: "Carewell Homeopathic Clinic"
      },
      demographics: {
        name: "Sabitha",
        age: 58,
        sex: "Female",
        religion: "Hindu",
        caste: "Nair",
        education: "B.A. Literature",
        training: "Handicrafts",
        occupation: "Homemaker",
        spouseName: "Raghavan",
        spouseOccupation: "Retired Teacher",
        address: "45/B, Rose Villa, Kottayam, Kerala",
        phone: "9988776655",
        economicStatus: "Middle Class",
        socialStatus: "Respected in community",
        nutritionalStatus: "Good, but tends to overeat",
        maritalStatus: "Married",
        yearsOfMarriage: "35",
        dwellings: "Own concrete house, well ventilated",
        customs: "Traditional family values",
        politicalStatus: "Neutral"
      },
      summaryDiagnosis: {
        diseaseDiagnosis: "Hypothyroidism with Bilateral OA & Varicose Veins",
        homeopathicDiagnosis: "Calcarea Carbonica",
        result: "Relieved"
      },

      // 2. INITIAL PRESENTATION
      initialPresentation: {
        patientNarration: "Ipsisima Verba: 'Doctor, I feel like a heavy log. Every limb feels weighted down. My neck is swollen and my memory is failing. I can't climb stairs anymore because my knees crack and pain. The blue veins on my legs are like worms crawling at night. Worst is the nail-like prick under my foot.'",
        physicianInterpretation: "Metabolic slowdown with chronic degenerative changes and venous congestion.",
        physicianObservation: "Obese, pale complexion, slow deliberate movements, slightly damp hands."
      },

      // 3. PRESENTING COMPLAINTS (Spec columns: Loc, Sens, Mod, Acc)
      presentingComplaints: [
        {
          complaintType: "Chief",
          location: { system: "Endocrine", organ: "Thyroid", areas: "Anterior Neck", duration: "8 Years" },
          sensation: "Heaviness and internal pressure",
          modalities: { aggravation: "Cold draft, morning", amelioration: "Warm application" },
          accompaniments: "Puffy face, hair thinning"
        },
        {
          complaintType: "Chief",
          location: { system: "Musculoskeletal", organ: "Knee Joints", areas: "Bilateral", extension: "Calves", duration: "3 Years" },
          sensation: "Stitching and cracking pain",
          modalities: { aggravation: "Climbing stairs, cold damp air", amelioration: "Rest, gentle rubbing" },
          accompaniments: "Stiffness on first moving"
        },
        {
          complaintType: "Chief",
          location: { system: "Skin", organ: "Left Foot", areas: "Sole, below big toe", duration: "6 Months" },
          sensation: "Nail-like pricking, very sensitive",
          modalities: { aggravation: "Walking on hard surfaces, pressure" },
          accompaniments: "Hardening of surrounding skin"
        }
      ],

      // 4. HISTORY OF PRESENT ILLNESS
      historyOfPresentIllness: {
        narrative: "Complaints started insidiously. Weight gain was the first sign after a period of family stress. Joint pains followed a year later.",
        onset: "Gradual, following second pregnancy",
        cause: "Hormonal imbalance triggered by stress",
        progression: "Progressive weight gain and decreasing mobility",
        frequency: "Continuous symptoms with evening aggravation"
      },

      // 5. HISTORY OF PREVIOUS ILLNESS
      previousIllnessHistory: [
        { age: "12", event: "Chicken Pox", treatment: "Homeopathic", remarks: "Uneventful" },
        { age: "40", event: "Hysterectomy", treatment: "Surgical", remarks: "For uterine fibroids" }
      ],

      // 6. HISTORY OF FAMILY ILLNESS
      familyHistory: [
        { relation: "Mother", disease: "Diabetes & Varicose", status: "Dead", age: "72" },
        { relation: "Father", disease: "Heart Attack", status: "Dead", age: "65" }
      ],

      // 7. PERSONAL HISTORY
      personalHistory: {
        familyStatus: { type: "Joint", details: "Husband, son, daughter-in-law" },
        developmentMilestones: { fontanellaClosure: "Normal", walking: "14 months", talking: "12 months" },
        birthHistory: { type: "Normal", weightKg: 3.2, immunization: "Complete up to date" },
        habitsHobbies: { diet: "Vegetarian", addictions: ["Tea (excessive)"], sleep: "Sleepy, but waking with heaviness", artistic: "Classical Music" },
        domesticRelations: { family: "Supportive", neighbours: "Cordial" },
        sexualRelations: { type: "Marital", details: "Satisfactory" }
      },

      // 8. LIFE SPACE INVESTIGATION
      lifeSpaceInvestigation: {
        mentalFeatures: ["Fastidious", "Anxious", "Religious", "Yielding", "Timid", "Sentimental"],
        emotionalFactors: [
          { factor: "Grief", occasion: "Loss of parent", duration: "1 year persistent" }
        ],
        reactionPatterns: [
          { trigger: "Consolation", amelioration: "Feels much better" },
          { trigger: "Contradiction", aggravation: "Becomes tearful" }
        ],
        otherFeatures: { perception: "Clear but slow", memory: "Forgetful of recent chores", thinking: "Systematic" }
      },

      // 9. PHYSICAL FEATURES
      physicalFeatures: {
        appearance: { build: "Obese", stature: "Large", complexion: "Healthy", ageAppearance: "Young", cleanliness: "Clean" },
        regionalExamination: { headScalpHair: "Dandruff, thinning hair", eyesVision: "Hypermetropia", throatTonsilsLarynxVoice: "Husky voice in morning" },
        generals: { appetite: "Good for sweets", thirst: "Thirstless", sweat: "Profuse on head during sleep", sleep: "Snoring noted" },
        reactionsToFactors: [
          { factor: "Thermal", intolerance: "Cold air", aggravation: "Damp weather" }
        ],
        constitution: { physicalMakeup: "Carbon", temperament: "Phlegmatic", thermal: "Cold", sideAffinity: "Left", tendencies: ["Fatty", "Catch cold"] }
      },

      // 10. PHYSICAL EXAMINATION
      physicalExamination: {
        general: { jaundice: "Nil", anemia: "Mild", oedema: "Pedal oedema (slight)", skinColor: "Pale" },
        vitals: { height: "160", weight: "81", bmi: "31.6", bp: "130/90", pulse: "78", temperature: "98.4" },
        systemic: { gastrointestinal: "Bloated after meals", musculoskeletal: "Crepitus Bilateral Knee", respiratory: "Clear" }
      },

      // 11. FEMALE HISTORY
      femaleHistory: {
        menstrual: { menopause: { age: "50", stage: "Post", symptoms: "Hot flushes initially" } }
      },

      // 13 & 14. ANALYSIS & DIAGNOSIS
      analysisAndDiagnosis: {
        symptomAnalysis: { basicCommon: "Swelling, tiredness", determinativeUncommon: "Profuse head sweat, fastidiousness, chilly but thirstless" },
        evaluation: { totalityOfSymptoms: "Obese, chilly female with hypothyroid and OA. Profuse sweat on head. Thirstless. Fastidious. Left sided focus.", miasmaticExpression: ["Psora", "Sycosis"] },
        finalDiagnosis: { disease: "Hypothyroidism", homeopathicDiagnosis: "Calcarea Carbonica" }
      },

      // 15. MANAGEMENT
      management: {
        plan: "Constitutional anti-miasmatic treatment. Diet rich in fiber, low in sugar.",
        restrictions: { diet: "Limit sweets and starchy food", regimen: "Daily 20 mins brisk walking" },
        firstPrescription: { basis: "Constitutional Totality", medicine: "Calcarea Carb", potency: "200c", dose: "Once weekly for 4 weeks" }
      }
    };

    const newCase = new ChronicCase(chronicData);
    await newCase.save();
    console.log("✅ Sabitha's data seeded successfully with full 16-section compliance.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

run();
