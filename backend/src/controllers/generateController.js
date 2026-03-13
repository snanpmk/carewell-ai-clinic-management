const crypto = require("crypto");
const AICache = require("../models/AICache");
const { generateConsultationNotes, summarizePatientHistory, analyzeChronicCase, extractClinicalContext, extractLSMA } = require("../services/aiService");

/**
 * Helper to generate a stable hash for any object
 */
const generateHash = (data) => {
  const str = JSON.stringify(data);
  return crypto.createHash("sha256").update(str).digest("hex");
};

/**
 * POST /api/ai/generate-notes
 * Accepts symptom data, calls the Gemini AI service,
 * and returns structured consultation notes.
 */
const generateNotes = async (req, res) => {
  try {
    const { symptoms, modalities, generals, mentals, diagnosis, prescription, additionalNotes } = req.body;

    if (!symptoms) {
      return res.status(400).json({
        success: false,
        error: "Symptoms are required to generate notes.",
      });
    }

    const inputData = { 
      symptoms, 
      modalities: modalities || "", 
      generals: generals || "", 
      mentals: mentals || "", 
      diagnosis: diagnosis || "", 
      prescription: prescription || "", 
      additionalNotes: additionalNotes || "" 
    };

    const inputHash = generateHash(inputData);

    // Check Cache
    const cachedResponse = await AICache.findOne({ inputHash, useCase: "generateNotes" });
    if (cachedResponse) {
      console.log("💾 Returning cached AI notes");
      return res.status(200).json({ success: true, data: cachedResponse.outputData });
    }

    // Call AI
    const notes = await generateConsultationNotes(inputData);

    // Save to Cache
    await AICache.create({
      inputHash,
      inputData,
      outputData: notes,
      useCase: "generateNotes"
    }).catch(err => console.error("Cache save error:", err.message));

    return res.status(200).json({ success: true, data: notes });
  } catch (error) {
    console.error("generateNotes error:", error.message);

    if (error instanceof SyntaxError) {
      return res.status(502).json({
        success: false,
        error: "AI returned an unexpected response. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message?.includes("quota") 
        ? "AI Speed limit reached. Please wait a minute before trying again."
        : "AI service is currently unavailable. Please try again.",
    });
  }
};

/**
 * POST /api/ai/summarize-history
 * Accepts an array of consultations and returns a summary paragraph.
 */
const summarizeHistory = async (req, res) => {
  try {
    const { consultations } = req.body;
    
    if (!consultations || !Array.isArray(consultations)) {
      return res.status(400).json({
        success: false,
        error: "An array of consultations is required.",
      });
    }

    // Hash only the essential IDs and summary fields from consultations to keep hash stable
    const inputHash = generateHash(consultations.map(c => ({ id: c._id, symptoms: c.symptoms })));

    // Check Cache
    const cachedResponse = await AICache.findOne({ inputHash, useCase: "summarizeHistory" });
    if (cachedResponse) {
      console.log("💾 Returning cached history summary");
      return res.status(200).json({ success: true, data: cachedResponse.outputData });
    }

    const summary = await summarizePatientHistory(consultations);

    // Save to Cache
    await AICache.create({
      inputHash,
      inputData: { consultationCount: consultations.length },
      outputData: summary,
      useCase: "summarizeHistory"
    }).catch(err => console.error("Cache save error:", err.message));

    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error("summarizeHistory error:", error.message);
    return res.status(500).json({
      success: false,
      error: "AI service failed to summarize history.",
    });
  }
};

/**
 * POST /api/ai/analyze-chronic-case
 * Analyzes a full chronic case JSON and returns Miasm, Totality, and Repertorization.
 */
const analyzeChronicCaseController = async (req, res) => {
  try {
    const caseData = req.body;
    
    if (!caseData || Object.keys(caseData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Case data is required.",
      });
    }

    // Hash only the clinical fields — prevents cache misses on unrelated changes (address, unit, etc.)
    const clinicalContext = extractClinicalContext(caseData);
    const inputHash = generateHash(clinicalContext);

    // Check Cache
    const cachedResponse = await AICache.findOne({ inputHash, useCase: "analyzeChronicCase" });
    if (cachedResponse) {
      console.log("💾 Returning cached chronic case analysis");
      return res.status(200).json({ success: true, data: cachedResponse.outputData });
    }

    const analysis = await analyzeChronicCase(caseData);

    // Save to Cache
    await AICache.create({
      inputHash,
      inputData: clinicalContext,
      outputData: analysis,
      useCase: "analyzeChronicCase"
    }).catch(err => console.error("Cache save error:", err.message));

    return res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error("analyzeChronicCase error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message?.includes("quota")
        ? "AI speed limit reached. Please wait a moment and try again."
        : "AI service failed to analyze chronic case.",
    });
  }
};

const Consultation = require("../models/Consultation");
const ChronicCase = require("../models/ChronicCase");

/**
 * POST /api/ai/extract-lsma
 * Extracts symptom totality components (LSMA) from raw clinical text.
 */
const extractLSMAController = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 10) {
      return res.status(400).json({ success: false, error: "Text is too short for extraction." });
    }

    const inputHash = generateHash({ text });

    // Check Cache
    const cachedResponse = await AICache.findOne({ inputHash, useCase: "extractLSMA" });
    if (cachedResponse) {
      console.log("💾 Returning cached LSMA extraction");
      return res.status(200).json({ success: true, data: cachedResponse.outputData });
    }

    const extraction = await extractLSMA(text);

    // Save to Cache
    await AICache.create({
      inputHash,
      inputData: { textLength: text.length },
      outputData: extraction,
      useCase: "extractLSMA"
    }).catch(err => console.error("Cache save error:", err.message));

    return res.status(200).json({ success: true, data: extraction });
  } catch (error) {
    console.error("extractLSMA error:", error.message);
    return res.status(500).json({ success: false, error: "AI failed to extract symptoms." });
  }
};

/**
 * GET /api/ai/next-op-number
 * Generates a unique, incremental OP number for the clinic.
 */
const getNextOPNumber = async (req, res) => {
  try {
    const clinicId = req.clinicId;
    const currentYear = new Date().getFullYear();

    // Count both acute consultations and chronic cases for this clinic
    const consultationCount = await Consultation.countDocuments({ clinic: clinicId });
    const chronicCount = await ChronicCase.countDocuments({ clinic: clinicId });

    const totalCount = consultationCount + chronicCount + 1;
    
    // Format: OP-2024-001 (Zero-padded to 3 digits)
    const paddedCount = String(totalCount).padStart(3, "0");
    const opNumber = `OP-${currentYear}-${paddedCount}`;

    return res.status(200).json({ success: true, data: { opNumber } });
  } catch (error) {
    console.error("getNextOPNumber error:", error.message);
    return res.status(500).json({ success: false, error: "Failed to generate OP number." });
  }
};

module.exports = { generateNotes, summarizeHistory, analyzeChronicCaseController, extractLSMAController, getNextOPNumber };
