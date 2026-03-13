const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------------------------------------------------------------------
// Retry helper
// ---------------------------------------------------------------------------
const withRetry = async (fn, maxRetries = 2, delayMs = 1000) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isQuota =
        err?.status === 429 ||
        err?.message?.toLowerCase().includes("quota") ||
        err?.message?.toLowerCase().includes("rate");

      if (attempt < maxRetries && isQuota) {
        console.warn(`⚠️  AI quota hit, retrying in ${delayMs}ms… (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, delayMs));
        delayMs *= 2;
        continue;
      }
      throw err;
    }
  }
};

// ---------------------------------------------------------------------------
// Global JSON Response Parser
// ---------------------------------------------------------------------------
const parseResponse = (response) => {
  const text = response.text();
  const finishReason = response.candidates?.[0]?.finishReason;
  
  if (!text) {
    console.error("❌ AI returned empty response. Finish Reason:", finishReason);
    throw new Error(`AI returned empty response (Reason: ${finishReason})`);
  }
  
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    
    if (start !== -1 && end !== -1) {
      const extracted = cleaned.substring(start, end + 1);
      try {
        return JSON.parse(extracted);
      } catch (innerErr) {
        console.error("❌ AI JSON PARSE ERROR ❌");
        console.error("Finish Reason:", finishReason);
        console.error("Raw Text Length:", text.length);
        console.error("Full Raw Text (JSON stringified):", JSON.stringify(text));
        console.error("--------------------------");
      }
    }
    throw new SyntaxError(`AI response contained no valid JSON structure (Reason: ${finishReason})`);
  }
};

// ---------------------------------------------------------------------------
// Slim the chronic case data sent to the model
// ---------------------------------------------------------------------------
const extractClinicalContext = (caseData) => {
  const c = caseData || {};
  return {
    demographics: {
      age: c.demographics?.age,
      sex: c.demographics?.sex,
      occupation: c.demographics?.occupation,
    },
    initialPresentation: {
      patientNarration: c.initialPresentation?.patientNarration,
      physicianObservation: c.initialPresentation?.physicianObservation,
      physicianInterpretation: c.initialPresentation?.physicianInterpretation,
    },
    presentingComplaints: c.presentingComplaints?.map((pc) => ({
      type: pc.complaintType,
      location: pc.location,
      sensation: pc.sensation,
      modalities: pc.modalities,
      accompaniments: pc.accompaniments,
    })) || [],
    historyOfPresentIllness: {
      progression: c.historyOfPresentIllness?.progression,
      cause: c.historyOfPresentIllness?.cause,
      previousTreatments: c.historyOfPresentIllness?.previousTreatments,
    },
    lifeSpaceInvestigation: {
      traits: c.lifeSpaceInvestigation?.traits,
      emotionalFactors: c.lifeSpaceInvestigation?.emotionalFactors,
      otherFeatures: c.lifeSpaceInvestigation?.otherFeatures,
    },
    physicalFeatures: {
      generals: c.physicalFeatures?.generals,
      constitution: c.physicalFeatures?.constitution,
    },
    physicalExamination: {
      vitals: c.physicalExamination?.vitals,
      general: c.physicalExamination?.general,
    },
    management: {
      firstPrescription: c.management?.firstPrescription,
    },
    summaryDiagnosis: c.summaryDiagnosis,
  };
};

// ---------------------------------------------------------------------------
// Acute Consultation Notes
// ---------------------------------------------------------------------------
const generateConsultationNotes = async (symptomData) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });

  const prompt = `Convert consultation data into structured JSON.
Symptom: ${symptomData.symptoms}
Modalities: ${symptomData.modalities || "N/A"}
Generals: ${symptomData.generals || "N/A"}
Mentals: ${symptomData.mentals || "N/A"}
Diagnosis: ${symptomData.diagnosis || "N/A"}
Prescription: ${symptomData.prescription || "N/A"}
Notes: ${symptomData.additionalNotes || "N/A"}

Format: { "chiefComplaint": "...", "assessment": "...", "advice": "...", "aiSuggestions": "..." }`;

  return withRetry(async () => {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.1, responseMimeType: "application/json" }
    });
    return parseResponse(result.response);
  });
};

// ---------------------------------------------------------------------------
// Patient History Summarization
// ---------------------------------------------------------------------------
const summarizePatientHistory = async (consultations) => {
  if (!consultations || consultations.length === 0) return "No clinical history recorded.";
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });

  const formattedVisits = consultations.map((v, i) => {
    if (v.isChronic) {
      return `[Chronic Case ${v.date}] Diagnosis: ${v.diagnosis || 'Pending'}. Complaints: ${v.symptoms || 'N/A'}`;
    }
    return `[Acute Visit ${v.date}] Symptoms: ${v.symptoms}. Diagnosis: ${v.diagnosis || 'N/A'}`;
  }).join("\n");

  const prompt = `You are a clinical analyst. Summarize this patient's medical history into a professional 'Clinical Trajectory'.
Focus on:
1. Recurring symptom patterns and depth of the case.
2. Progression or resolution of complaints over time.
3. Dominant clinical themes.

History:
${formattedVisits}

Write a dense, 2-3 sentence professional summary. Avoid conversational language.`;

  return withRetry(async () => {
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
  });
};

// ---------------------------------------------------------------------------
// Chronic Case Analysis
// ---------------------------------------------------------------------------
const analyzeChronicCase = async (caseData) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });
  const context = extractClinicalContext(caseData);
  const prompt = `Analyze chronic case data. Return JSON with totalityOfSymptoms, miasmaticExpression, repertorization (list of {symptom, rubric, explanation}), differentialConsiderations, prescriptionInsight.
Data: ${JSON.stringify(context)}`;

  return withRetry(async () => {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.1, responseMimeType: "application/json" }
    });
    return parseResponse(result.response);
  });
};

// ---------------------------------------------------------------------------
// Extract LSMA (Location, Sensation, Modality, Accompaniment)
// ---------------------------------------------------------------------------
const extractLSMA = async (text) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });

  const prompt = `You are a homeopathic clinical assistant. Extract symptoms from the patient's narration into a structured LSMA (Location, Sensation, Modality, Accompaniment) framework.

NARRATION:
"${text}"

Rules:
1. Return a JSON object with a "symptoms" array.
2. For each symptom, provide complaintType ("Chief" or "Associated"), location (system, organ, tissue, direction, extension, duration), sensation, modalities (aggravation, amelioration, equivalent), and accompaniments.
3. Be clinical and concise.

JSON Structure:
{
  "symptoms": [
    {
      "complaintType": "Chief",
      "location": { "system": "", "organ": "", "tissue": "", "direction": "", "extension": "", "duration": "" },
      "sensation": "",
      "modalities": { "aggravation": "", "amelioration": "", "equivalent": "" },
      "accompaniments": ""
    }
  ]
}`;

  return withRetry(async () => {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4096, temperature: 0.1, responseMimeType: "application/json" }
    });
    return parseResponse(result.response);
  });
};

module.exports = { generateConsultationNotes, summarizePatientHistory, analyzeChronicCase, extractClinicalContext, extractLSMA };
