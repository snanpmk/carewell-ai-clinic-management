require("dotenv").config();
const { analyzeChronicCase } = require("./src/services/aiService");

async function testChronicAI() {
  const mockCaseData = {
    demographics: { name: "Jane Doe", age: 45, sex: "Female", occupation: "Teacher" },
    initialPresentation: {
      patientNarration: "I've been suffering from chronic eczema for 10 years. It's worse in winter and when I'm stressed about school work. The itching is unbearable at night.",
      physicianObservation: "Patient appears anxious, constantly adjusting her sleeves. Skin on elbows is thickened and red."
    },
    physicalFeatures: {
      generalAppearance: { build: "Thin", complexion: "Pale" },
      functionalGenerals: {
        appetite: "Craves sweets and highly seasoned food.",
        sleep: "Disturbed by thinking about daily chores.",
        thirst: "Thirsty for large quantities of cold water.",
        sweat: "Profuse on the scalp during sleep."
      }
    },
    lifeSpaceInvestigation: {
      traits: ["Fastidious", "Anxious", "Duty-bound"],
      cognitiveFunctions: "Very organized, struggles with unexpected changes in schedule."
    },
    historyOfPresentIllness: {
      progression: "Started after a period of intense grief 10 years ago. Has been suppressed with steroid creams multiple times."
    }
  };

  try {
    console.log("--- Testing Chronic Case AI Analysis ---");
    const result = await analyzeChronicCase(mockCaseData);
    console.log("SUCCESS:\n", JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}

testChronicAI();
