import type { ElectronStoreApi } from "../shared/electronStore";

declare global {
  interface Window {
    electronStore: ElectronStoreApi;
  }
}

export {};
