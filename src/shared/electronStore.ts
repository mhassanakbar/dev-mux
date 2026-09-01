export const electronStoreChannels = {
  getItem: "electron-store:get-item",
  setItem: "electron-store:set-item",
  removeItem: "electron-store:remove-item",
} as const;

export type ElectronStoreApi = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};
