import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  privacyMode: boolean;
  togglePrivacyMode: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      privacyMode: false,
      togglePrivacyMode: () => set((state) => ({ privacyMode: !state.privacyMode })),
    }),
    {
      name: "carewell-ui-storage",
    }
  )
);
