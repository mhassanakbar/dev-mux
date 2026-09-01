import { ipcMain } from "electron";
import ElectronStore from "electron-store";

import { electronStoreChannels } from "../shared/electronStore";

type PersistedJson = Record<string, string>;

function requireString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`${field} must be a string`);
  }
}

export function registerElectronStoreHandlers() {
  const store = new ElectronStore<PersistedJson>({ name: "zustand" });

  ipcMain.handle(electronStoreChannels.getItem, (_event, key: unknown) => {
    requireString(key, "key");
    return store.get(key) ?? null;
  });

  ipcMain.handle(
    electronStoreChannels.setItem,
    (_event, key: unknown, value: unknown) => {
      requireString(key, "key");
      requireString(value, "value");
      store.set(key, value);
    },
  );

  ipcMain.handle(electronStoreChannels.removeItem, (_event, key: unknown) => {
    requireString(key, "key");
    store.delete(key);
  });
}
