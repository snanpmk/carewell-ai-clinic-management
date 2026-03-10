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
      [key: string]: unknown;
    } | string;
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
