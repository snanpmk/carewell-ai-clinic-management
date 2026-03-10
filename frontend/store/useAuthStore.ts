import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Clinic {
  _id: string;
  name: string;
  address?: string;
  aiEnabled: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  role?: string;
  clinic: Clinic;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateClinic: (clinic: Clinic) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateClinic: (clinic) => set((state) => ({
        user: state.user ? { ...state.user, clinic } : null
      })),
    }),
    {
      name: "auth-storage",
    }
  )
);
