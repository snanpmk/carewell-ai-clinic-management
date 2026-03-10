import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Centralized Axios instance for all API calls.
 * Base URL is read from environment variables — never hardcoded.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/auth";
    }
    const message =
      error?.response?.data?.error ||
      error?.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
