import { electronJsonStorage } from "@/lib/electronJsonStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

type SettingsState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useSettingsState = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "settings",
      version: 1,
      storage: createJSONStorage(() => electronJsonStorage),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
