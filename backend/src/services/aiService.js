const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Professional Scribe Prompt for Acute Consultations
 */
const buildPrompt = ({ symptoms, modalities, generals, mentals, diagnosis, additionalNotes }) => {
  return `You are a professional Clinical Scribe and Homeopathic Analytical Assistant. 
Your goal is to synthesize raw consultation data into a formal medical structure.

### STRICT GUIDELINES:
1. TONE: Professional, objective, and clinical. Use medical terminology.
2. NON-PRESCRIPTIVE: NEVER tell the doctor what to do. NEVER write a "Prescription". 
3. ROLE: You are an assistant. You suggest considerations; the doctor makes all decisions.
4. NO FILLER: Do not say "Based on the notes..." or "I suggest...". Start directly with data.

### INPUT DATA:
- Chief Complaint: ${symptoms}
- Modalities: ${modalities || "None provided"}
- Physical Generals: ${generals || "None provided"}
- Mentals/Disposition: ${mentals || "None provided"}
- Provisional Diagnosis: ${diagnosis || "None provided"}
- Contextual Notes: ${additionalNotes || "None"}

### RESPONSE STRUCTURE (JSON):
{
  "chiefComplaint": "A professional clinical synthesis of the symptoms, including duration and intensity if provided.",
  "assessment": "A summary of the clinical picture. Categorize symptoms into Location, Sensation, Modality, and Accompaniment (LSMA) where possible.",
  "advice": "Suggested clinical management, lifestyle advice, or observation points based ONLY on the doctor's notes. Do NOT suggest new medicines here.",
  "aiSuggestions": "Clinical Considerations: List 2-3 potential homeopathic remedy profiles that share this specific symptom totality (for Materia Medica study) and 1-2 'Peculiar, Queer, Rare, and Strange' (PQRS) symptoms identified."
}

Respond ONLY with valid JSON.`;
};

/**
 * Calls the Gemini API to generate structured consultation notes.
 */
const generateConsultationNotes = async (symptomData) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-flash-latest",
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.1, // Low temperature for high professionalism and consistency
      responseMimeType: "application/json",
    },
  });

  const prompt = buildPrompt(symptomData);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  let parsed;
  try {
    const cleanedText = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    parsed = JSON.parse(cleanedText);
  } catch (parseError) {
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1) {
      parsed = JSON.parse(text.substring(startIdx, endIdx + 1));
    } else {
      throw new SyntaxError("AI response contained no valid JSON structure.");
    }
  }

  return parsed;
};

/**
 * Professional History Summarization (Trajectory Mapping)
 */
const summarizePatientHistory = async (consultations) => {
  if (!consultations || consultations.length === 0) {
    return "No clinical history recorded for this patient profile.";
  }

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-flash-latest",
    generationConfig: { maxOutputTokens: 1000, temperature: 0.1 },
  });

  const formattedVisits = consultations.map((v, i) => {
     let notes = null;
     try { if(v.aiGeneratedNotes) notes = JSON.parse(v.aiGeneratedNotes); } catch(e){}
     const diag = v.diagnosis || notes?.assessment || "N/A";
     return `Visit ${i+1}: ${v.symptoms}. Assessment: ${diag}.`;
  }).join("\n");

  const prompt = `You are a clinical analyst. Summarize the following patient history into a professional 'Clinical Trajectory'.
Focus on:
1. Recurring symptom patterns.
2. Progression or resolution of complaints.
3. Dominant miasmatic trends if evident.

History:
${formattedVisits}

Write a dense, 2-3 sentence professional summary. Avoid conversational language.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim().replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
};

/**
 * Expert Chronic Case Analysis (Totality & Repertorization)
 */
const analyzeChronicCase = async (caseData) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-flash-latest",
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are an expert Homeopathic Consultant Assistant. Analyze this chronic case to extract clinical insights.

### GOALS:
1. Totality: Synthesize the most striking, characteristic symptoms.
2. Miasm: Identify the dominant miasmatic layer (Psora, Sycosis, Syphilis, Tubercular).
3. Rubrics: Suggest classical repertory rubrics for consideration.

### STRICT RULES:
- NEVER provide a final prescription.
- Use 'Differential Considerations' instead of 'Recommended Remedies'.
- Focus on the 'Why' behind the analysis.

Case Data (JSON):
${JSON.stringify(caseData, null, 2)}

### RESPONSE (JSON):
{
  "totalityOfSymptoms": "A comprehensive clinical synthesis of the case totality.",
  "miasmaticExpression": "Analysis of the dominant miasm with clinical justification.",
  "repertorization": [
    { "symptom": "Original symptom", "rubric": "Suggested Repertory Rubric", "explanation": "Logic for this rubric selection" }
  ],
  "differentialConsiderations": "A list of 3-5 remedies whose pathogenesis matches this totality for the doctor to study."
}

Respond ONLY with valid JSON.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  let parsed;
  try {
    const cleanedText = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    parsed = JSON.parse(cleanedText);
  } catch (parseError) {
    const startIdx = text.indexOf("{");
    const endIdx = text.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1) {
      parsed = JSON.parse(text.substring(startIdx, endIdx + 1));
    } else {
      throw new SyntaxError("AI response contained no valid JSON structure.");
    }
  }

  return parsed;
};

module.exports = { generateConsultationNotes, summarizePatientHistory, analyzeChronicCase };
