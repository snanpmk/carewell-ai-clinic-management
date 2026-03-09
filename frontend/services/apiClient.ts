import axios from "axios";

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

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
