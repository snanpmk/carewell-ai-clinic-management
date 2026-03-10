import { ChronicCase } from "../types/chronicCase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const createChronicCase = async (caseData: Partial<ChronicCase>): Promise<ChronicCase> => {
  const response = await fetch(`${API_BASE_URL}/chronicCases`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(caseData),
  });
  if (!response.ok) throw new Error("Failed to create chronic case");
  const data = await response.json();
  return data.data;
};

export const getChronicCase = async (id: string): Promise<ChronicCase> => {
  const response = await fetch(`${API_BASE_URL}/chronicCases/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch chronic case");
  const data = await response.json();
  return data.data;
};

export const getPatientChronicCases = async (patientId: string): Promise<ChronicCase[]> => {
  const response = await fetch(`${API_BASE_URL}/chronicCases/patient/${patientId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch patient chronic cases");
  const data = await response.json();
  return data.data;
};

export const updateChronicCase = async (id: string, updates: Partial<ChronicCase>): Promise<ChronicCase> => {
  const response = await fetch(`${API_BASE_URL}/chronicCases/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update chronic case");
  const data = await response.json();
  return data.data;
};

export const analyzeChronicCaseWithAI = async (caseData: Partial<ChronicCase>) => {
  const response = await fetch(`${API_BASE_URL}/ai/analyze-chronic-case`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(caseData),
  });
  if (!response.ok) throw new Error("Failed to analyze chronic case");
  const data = await response.json();
  return data.data;
};
