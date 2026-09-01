// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

import {
  electronStoreChannels,
  type ElectronStoreApi,
} from "../shared/electronStore";

const electronStore: ElectronStoreApi = {
  getItem: (key) => ipcRenderer.invoke(electronStoreChannels.getItem, key),
  setItem: (key, value) =>
    ipcRenderer.invoke(electronStoreChannels.setItem, key, value),
  removeItem: (key) =>
    ipcRenderer.invoke(electronStoreChannels.removeItem, key),
};

contextBridge.exposeInMainWorld("electronStore", electronStore);
