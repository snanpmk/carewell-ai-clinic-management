import apiClient from "./apiClient";

export interface SymptomData {
  symptoms: string;
  modalities?: string;
  generals?: string;
  mentals?: string;
  diagnosis?: string;
  prescription?: string;
  additionalNotes?: string;
}

export interface ConsultationNotes {
  chiefComplaint: string;
  assessment: string;
  advice: string;
  aiSuggestions?: string;
}

export interface SaveConsultationPayload {
  patientId: string;
  symptoms: string;
  modalities?: string;
  generals?: string;
  mentals?: string;
  diagnosis?: string;
  prescription?: string;
  additionalNotes?: string;
  aiGeneratedNotes: ConsultationNotes | string;
  doctorEditedNotes: ConsultationNotes | string;
  opNumber?: string;
  status?: "Scheduled" | "In-Progress" | "Completed";
}

/**
 * Call the backend AI endpoint to generate structured consultation notes.
 */
export const generateNotes = async (
  data: SymptomData
): Promise<{ success: boolean; data: ConsultationNotes }> => {
  const response = await apiClient.post("/api/ai/generate-notes", data);
  return response.data;
};

/**
 * Save the final consultation record (including doctor edits) to the database.
 */
export const saveConsultation = async (data: SaveConsultationPayload) => {
  const response = await apiClient.post("/api/consultations", data);
  return response.data;
};

/**
 * Update an existing consultation record.
 */
export const updateConsultation = async (id: string, data: Partial<SaveConsultationPayload>) => {
  const response = await apiClient.put(`/api/consultations/${id}`, data);
  return response.data;
};

/**
 * Fetch all consultations for a patient.
 */
export const getConsultationsByPatient = async (patientId: string) => {
  const response = await apiClient.get(`/api/consultations/${patientId}`);
  return response.data;
};

/**
 * Fetch all consultations.
 */
export const getAllConsultations = async () => {
  const response = await apiClient.get("/api/consultations/all");
  return response.data;
};

/**
 * Ask AI to summarize the patient's history based on their consultation records.
 */
export const summarizeHistory = async (consultations: unknown[]) => {
  const response = await apiClient.post("/api/ai/summarize-history", { consultations });
  return response.data;
};
