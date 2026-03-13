import apiClient from "./apiClient";

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  sex?: "Male" | "Female" | "Other"; // Alias for gender used in chronic cases
  phone: string;
  email: string;
  address?: string;
  existingConditions?: string;
}

export interface PatientFormData {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  address?: string;
  existingConditions?: string;
}

export interface RegisterPatientResponse {
  success: boolean;
  data: { patientId: string; name: string };
}

/**
 * Register a new patient with the backend.
 */
export const registerPatient = async (
  data: PatientFormData
): Promise<RegisterPatientResponse> => {
  const response = await apiClient.post("/api/patients", data);
  return response.data;
};

/**
 * Fetch a patient by their ID.
 */
export const getPatient = async (id: string) => {
  const response = await apiClient.get(`/api/patients/${id}`);
  return response.data;
};

/**
 * Fetch all patients.
 */
export const getAllPatients = async () => {
  const response = await apiClient.get("/api/patients");
  return response.data;
};

/**
 * Upload an image to the backend (Cloudinary).
 * type can be 'users', 'patients', or 'clinical'
 */
export const uploadImage = async (file: File, type: string = "misc"): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  // Send type as a query parameter so multer-storage-cloudinary can access it early
  const { data } = await apiClient.post(`/api/upload?type=${type}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
};
