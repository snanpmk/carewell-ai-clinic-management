const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Builds the structured prompt for the Gemini model.
 * Keeps tokens minimal while producing reliable JSON output.
 */
const buildPrompt = ({ symptoms, modalities, generals, mentals, diagnosis, prescription, additionalNotes }) => {
  return `You are a medical assistant and scribe for a homeopathic clinic. Your job is twofold:
1. Format the provided consultation details into a well-structured clinical note. Convert the doctor's raw notes logically.
2. Provide a short, helpful list of suggested questions to ask the patient, potential homeopathic remedies (Materia Medica) to consider based on symptoms+modalities+generals+mentals. DO NOT provide final diagnoses, just helpful insights for the doctor.

Patient Information:
- Chief Complaint / Symptoms: ${symptoms}
- Modalities (Better/Worse by): ${modalities || "None provided"}
- Physical Generals (Thirst, Sleep, Thermals, Appetite): ${generals || "None provided"}
- Mentals / Disposition: ${mentals || "None provided"}
- Diagnosis / Assessment: ${diagnosis || "None provided"}
- Prescription / Treatment: ${prescription || "None provided"}
- Additional Notes: ${additionalNotes || "None"}

Respond ONLY with a valid JSON object in this exact structure:
{
  "chiefComplaint": "The main complaint formatted nicely.",
  "assessment": "The diagnosis or clinical findings based ONLY on the provided notes.",
  "advice": "The prescription and treatment plan based ONLY on what the doctor provided.",
  "aiSuggestions": "A short, helpful string with 2-3 suggested follow-up questions or clinical considerations for the doctor to review."
}

Do not include any text outside of the JSON object.`;
};

/**
 * Calls the Gemini API to generate structured consultation notes.
 * @param {Object} symptomData - { symptoms, duration, severity, additionalNotes }
 * @returns {Object} - { chiefComplaint, assessment, advice }
 */
const generateConsultationNotes = async (symptomData) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 700,
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const prompt = buildPrompt(symptomData);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  let parsed;
  try {
    // Attempt direct parse first
    parsed = JSON.parse(text);
  } catch (parseError) {
    console.warn("AI returned malformed JSON, attempting recovery:", text);
    
    // Robust extraction fallback: find first '{' and last '}'
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    
    if (startIdx !== -1 && endIdx !== -1) {
      const extracted = text.substring(startIdx, endIdx + 1);
      try {
        parsed = JSON.parse(extracted);
      } catch (innerError) {
        console.error("Recovery failed, raw text:", text);
        throw new SyntaxError("AI response was not valid JSON even after extraction attempt.");
      }
    } else {
      throw new SyntaxError("AI response contained no valid JSON structure.");
    }
  }

  // Validate expected keys exist
  if (!parsed || !parsed.chiefComplaint || !parsed.assessment || !parsed.advice) {
    throw new Error("AI response missing required fields");
  }

  return parsed;
};

/**
 * Summarizes a patient's medical history based on past consultations.
 */
const summarizePatientHistory = async (consultations) => {
  if (!consultations || consultations.length === 0) {
    return "No visit history available to summarize.";
  }

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.3,
    },
  });

  const formattedVisits = consultations.map((v, i) => {
     let notes = null;
     try { if(v.aiGeneratedNotes) notes = JSON.parse(v.aiGeneratedNotes); } catch(e){}
     const diag = v.diagnosis || notes?.assessment || "None recorded";
     const rx = v.doctorEditedNotes || v.prescription || notes?.advice || "None recorded";
     return `Visit ${i+1} (${new Date(v.consultationDate).toLocaleDateString()}): Symptoms: ${v.symptoms}. Diagnosis: ${diag}. Prescription: ${rx}`;
  }).join("\n");

  const prompt = `You are a medical scribe summarizing a patient's clinic history.
Here are their past visits:
${formattedVisits}

Write a short, concise 2-3 sentence paragraph summarizing their past conditions and treatments. Ensure the summary is a complete sentence and not cut off. Do not use bullet points. Make it easy to read at a glance.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

/**
 * Analyzes a full chronic case and extracts homeopathic observations.
 */
const analyzeChronicCase = async (caseData) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 1500,
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are an expert Homeopathic AI doctor analyzing a detailed chronic case record.
  Your job is to identify the "Totality of Symptoms", "Miasmatic Expression", and potential "Repertorization" rubrics.

  Here is the raw case data (JSON format):
  ${JSON.stringify(caseData, null, 2)}

  Respond ONLY with a valid JSON object in this exact structure:
  {
    "totalityOfSymptoms": "A narrative string summarizing the characteristic and striking symptoms across the whole case.",
    "miasmaticExpression": "Psora / Sycosis / Syphilis or a combination, based on the history and symptoms, with a brief explanation.",
    "repertorization": [
      {
        "symptom": "The patient's symptom",
        "rubric": "The classical repertory rubric matching the symptom",
        "explanation": "Why this rubric is appropriate"
      }
    ],
    "suggestedRemedies": "A comma-separated list of top 3-5 homeopathic remedies to consider."
  }

  Do not include any text outside of the JSON object.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (parseError) {
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1) {
      const extracted = text.substring(startIdx, endIdx + 1);
      parsed = JSON.parse(extracted);
    } else {
      throw new SyntaxError("AI response was not valid JSON even after extraction attempt.");
    }
  }

  return parsed;
};

module.exports = { generateConsultationNotes, summarizePatientHistory, analyzeChronicCase };
