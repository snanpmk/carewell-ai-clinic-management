import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PatientFormData } from "@/services/patientService";
import type { SymptomData, ConsultationNotes } from "@/services/consultationService";

interface ClinicStore {
  // ── Patient ──────────────────────────────────────────────────────────────
  patientId: string | null;
  patientData: PatientFormData | null;
  setPatient: (id: string, data: PatientFormData) => void;

  // ── Symptoms ─────────────────────────────────────────────────────────────
  symptomData: SymptomData | null;
  setSymptomData: (data: SymptomData) => void;

  // ── AI Notes ─────────────────────────────────────────────────────────────
  aiNotes: ConsultationNotes | null;
  setAiNotes: (notes: ConsultationNotes) => void;

  // ── Reset ─────────────────────────────────────────────────────────────────
  reset: () => void;
}

const initialState = {
  patientId: null,
  patientData: null,
  symptomData: null,
  aiNotes: null,
};

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set) => ({
      ...initialState,

      setPatient: (id, data) => set({ patientId: id, patientData: data }),
      setSymptomData: (data) => set({ symptomData: data }),
      setAiNotes: (notes) => set({ aiNotes: notes }),

      reset: () => set(initialState),
    }),
    {
      name: "carewell-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
