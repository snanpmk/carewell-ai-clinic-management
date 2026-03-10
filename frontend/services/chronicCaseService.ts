import apiClient from "./apiClient";
import { ChronicCase } from "../types/chronicCase";

export const createChronicCase = async (caseData: Partial<ChronicCase>): Promise<ChronicCase> => {
  const response = await apiClient.post("/api/chronicCases", caseData);
  return response.data.data;
};

export const getChronicCase = async (id: string): Promise<ChronicCase> => {
  const response = await apiClient.get(`/api/chronicCases/${id}`);
  return response.data.data;
};

export const getPatientChronicCases = async (patientId: string): Promise<ChronicCase[]> => {
  const response = await apiClient.get(`/api/chronicCases/patient/${patientId}`);
  return response.data.data;
};

export const updateChronicCase = async (id: string, updates: Partial<ChronicCase>): Promise<ChronicCase> => {
  const response = await apiClient.put(`/api/chronicCases/${id}`, updates);
  return response.data.data;
};

export const analyzeChronicCaseWithAI = async (caseData: Partial<ChronicCase>) => {
  const response = await apiClient.post("/api/ai/analyze-chronic-case", caseData);
  return response.data.data;
};
