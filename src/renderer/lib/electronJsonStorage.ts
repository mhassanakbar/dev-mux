import type { StateStorage } from "zustand/middleware";

export const electronJsonStorage: StateStorage<Promise<void>> = {
  getItem: (name) => window.electronStore.getItem(name),
  setItem: (name, value) => window.electronStore.setItem(name, value),
  removeItem: (name) => window.electronStore.removeItem(name),
};
