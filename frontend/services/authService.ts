import apiClient from "./apiClient";

export interface AuthResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
    profileImage?: string;
    clinic: {
      _id: string;
      name: string;
      address?: string;
      aiEnabled: boolean;
      [key: string]: unknown;
    };
  };
}

export const loginWithGoogle = async (credential: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/api/auth/login", { credential });
  return data;
};

export const registerWithGoogle = async (payload: {
  clinicName?: string;
  clinicAddress?: string;
  doctorPhone: string;
  doctorLicense: string;
  credential: string;
  profileImage?: string | null;
}): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/api/auth/register", payload);
  return data;
};

export const acceptInviteWithGoogle = async (payload: {
  credential: string;
  inviteToken: string;
  doctorPhone: string;
  doctorLicense: string;
}): Promise<AuthResponse> => {
  const { data } = await apiClient.post("/api/auth/accept-invite", payload);
  return data;
};

export const getSystemStatus = async (): Promise<{ success: boolean; initialized: boolean }> => {
  const { data } = await apiClient.get("/api/auth/status");
  return data;
};

export const getMe = async () => {
  const { data } = await apiClient.get("/api/auth/me");
  return data;
};

export const updateProfile = async (payload: {
  name?: string;
  phone?: string;
  licenseNumber?: string;
  profileImage?: string | null;
}) => {
  const { data } = await apiClient.put("/api/auth/profile", payload);
  return data;
};

export const updateClinicDetails = async (payload: {
  name?: string;
  address?: string;
}) => {
  const { data } = await apiClient.put("/api/auth/clinic", payload);
  return data;
};

export const getClinicMembers = async () => {
  const { data } = await apiClient.get("/api/auth/clinic-members");
  return data;
};

export const inviteMember = async (email: string, role: "doctor" | "staff") => {
  const { data } = await apiClient.post("/api/auth/invite", { email, role });
  return data;
};

export const toggleAI = async (aiEnabled: boolean) => {
  const { data } = await apiClient.put("/api/auth/toggle-ai", { aiEnabled });
  return data;
};

export const removeMember = async (id: string) => {
  const { data } = await apiClient.delete(`/api/auth/members/${id}`);
  return data;
};
