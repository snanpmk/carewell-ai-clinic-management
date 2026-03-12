const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------------------------------------------------------------------
// Retry helper — handles quota (429) and transient errors
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
        delayMs *= 2; // exponential backoff
        continue;
      }
      throw err;
    }
  }
};

// ---------------------------------------------------------------------------
// Slim the chronic case data sent to the model — extract only clinical fields
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
// Acute Consultation Notes Prompt
// ---------------------------------------------------------------------------
const buildPrompt = ({ symptoms, modalities, generals, mentals, diagnosis, prescription, additionalNotes }) => {
  // Parse prescription for richer context
  let rxContext = "None provided";
  if (prescription) {
    try {
      const rxArr = typeof prescription === "string" ? JSON.parse(prescription) : prescription;
      if (Array.isArray(rxArr)) {
        rxContext = rxArr.map((r) => {
          const parts = [`${r.medicine || ""}${r.potency ? ` ${r.potency}` : ""}`, `Form: ${r.form || "?"}`, `Dose: ${r.dosage || r.dose || "?"}`];
          if (r.quantity) parts.push(`Qty: ${r.quantity}`);
          if (r.indication) parts.push(`Indication: ${r.indication}`);
          return parts.filter(Boolean).join(" | ");
        }).join("\n");
      }
    } catch {
      rxContext = prescription;
    }
  }

  return `You are a professional Clinical Scribe and Homeopathic Analytical Assistant.
Your goal is to synthesize raw consultation data into a formal medical structure.

### STRICT GUIDELINES:
1. TONE: Professional, objective, and clinical. Use medical terminology.
2. NON-PRESCRIPTIVE: NEVER tell the doctor what to do. NEVER write a prescription.
3. ROLE: You are an assistant. You suggest considerations; the doctor makes all decisions.
4. NO FILLER: Do not say "Based on the notes..." or "I suggest...". Start directly with data.

### INPUT DATA:
- Chief Complaint: ${symptoms}
- Modalities: ${modalities || "None provided"}
- Physical Generals: ${generals || "None provided"}
- Mentals/Disposition: ${mentals || "None provided"}
- Provisional Diagnosis: ${diagnosis || "None provided"}
- Dispensed Medicines: ${rxContext}
- Contextual Notes: ${additionalNotes || "None"}

### RESPONSE STRUCTURE (JSON):
{
  "chiefComplaint": "Professional clinical synthesis of the presenting complaint including duration and intensity where provided.",
  "assessment": "Clinical picture summary. Categorize symptoms into Location, Sensation, Modality, and Accompaniment (LSMA) where possible.",
  "advice": "Suggested management, lifestyle advice, or observation points based ONLY on the doctor's notes and dispensed medicines. Do NOT suggest new medicines.",
  "aiSuggestions": "Clinical Considerations: List 2-3 homeopathic remedy profiles matching this symptom totality (for Materia Medica study) and 1-2 PQRS (Peculiar, Queer, Rare, Strange) symptoms identified."
}

Respond ONLY with valid JSON.`;
};

// ---------------------------------------------------------------------------
// Generate structured acute consultation notes
// ---------------------------------------------------------------------------
const generateConsultationNotes = async (symptomData) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const prompt = buildPrompt(symptomData);

  const parseResponse = (text) => {
    const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) return JSON.parse(text.substring(start, end + 1));
      throw new SyntaxError("AI response contained no valid JSON structure.");
    }
  };

  return withRetry(async () => {
    const result = await model.generateContent(prompt);
    return parseResponse(result.response.text().trim());
  });
};

// ---------------------------------------------------------------------------
// Patient History Summarization
// ---------------------------------------------------------------------------
const summarizePatientHistory = async (consultations) => {
  if (!consultations || consultations.length === 0) {
    return "No clinical history recorded for this patient profile.";
  }

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    generationConfig: { maxOutputTokens: 1000, temperature: 0.1 },
  });

  const formattedVisits = consultations
    .map((v, i) => {
      let notes = null;
      try { if (v.aiGeneratedNotes) notes = JSON.parse(v.aiGeneratedNotes); } catch {}
      const diag = v.diagnosis || notes?.assessment || "N/A";
      return `Visit ${i + 1}: ${v.symptoms}. Assessment: ${diag}.`;
    })
    .join("\n");

  const prompt = `You are a clinical analyst. Summarize the following patient history into a professional 'Clinical Trajectory'.
Focus on:
1. Recurring symptom patterns.
2. Progression or resolution of complaints.
3. Dominant miasmatic trends if evident.

History:
${formattedVisits}

Write a dense, 2-3 sentence professional summary. Avoid conversational language.`;

  return withRetry(async () => {
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
  });
};

// ---------------------------------------------------------------------------
// Chronic Case Analysis — slim payload, richer prompt
// ---------------------------------------------------------------------------
const analyzeChronicCase = async (caseData) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  // Extract only what the model needs — reduces tokens by ~60%
  const clinicalContext = extractClinicalContext(caseData);

  // Build a prescription insight context if medicines were selected
  const medicines = clinicalContext.management?.firstPrescription?.medicines || [];
  const rxSection = medicines.length
    ? `### SELECTED FIRST PRESCRIPTION:\n${medicines.map((m) =>
        `- ${m.medicine || "?"} ${m.potency || ""} (${m.form || ""}) | Dose: ${m.dose || m.dosage || "?"} | Qty: ${m.quantity || "?"} | Indication: ${m.indication || "Not specified"}`
      ).join("\n")}`
    : "";

  const prompt = `You are an expert Homeopathic Consultant Assistant. Analyze this chronic case to extract clinical insights.

### GOALS:
1. Totality: Synthesize the most striking, characteristic symptoms into a clinical profile.
2. Miasm: Identify the dominant miasmatic layer (Psora, Sycosis, Syphilis, Tubercular) with justification.
3. Rubrics: Suggest 4-6 classical repertory rubrics for the totality.
4. Differentials: Suggest 3-5 remedies whose pathogenesis matches this totality (for study).
5. Prescription Insight: If a first prescription has been selected, evaluate how well the chosen remedy/remedies align with the totality and highlight any gaps or confirmatory features.

### STRICT RULES:
- NEVER provide a definitive prescription.
- Use 'Differential Considerations' — not 'Recommended Remedies'.
- Focus on the clinical 'Why' behind each analysis point.

${rxSection}

### CASE DATA (Clinical Context Only):
${JSON.stringify(clinicalContext, null, 2)}

### RESPONSE (JSON):
{
  "totalityOfSymptoms": "Comprehensive clinical synthesis of the case totality in 3-5 sentences.",
  "miasmaticExpression": "Analysis of the dominant miasm with clinical justification.",
  "repertorization": [
    { "symptom": "Original symptom", "rubric": "Suggested Repertory Rubric", "explanation": "Logic for rubric selection" }
  ],
  "differentialConsiderations": "3-5 remedies whose pathogenesis matches this totality for the doctor to study, with a brief reason for each.",
  "prescriptionInsight": "If a prescription was selected: evaluate the fit between the chosen remedy and the totality. If no prescription was selected, return an empty string."
}

Respond ONLY with valid JSON.`;

  const parseResponse = (text) => {
    const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) return JSON.parse(text.substring(start, end + 1));
      throw new SyntaxError("AI response contained no valid JSON structure.");
    }
  };

  return withRetry(async () => {
    const result = await model.generateContent(prompt);
    return parseResponse(result.response.text().trim());
  });
};

module.exports = { generateConsultationNotes, summarizePatientHistory, analyzeChronicCase, extractClinicalContext };
