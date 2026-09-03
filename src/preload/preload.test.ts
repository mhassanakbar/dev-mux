import { describe, expect, it, vi } from "vitest";

import type { ElectronStoreApi } from "../shared/electronStore";
import { electronStoreChannels } from "../shared/electronStore";

const mocks = vi.hoisted(() => ({
  exposeInMainWorld: vi.fn(),
  invoke: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("electron", () => ({
  contextBridge: { exposeInMainWorld: mocks.exposeInMainWorld },
  ipcRenderer: { invoke: mocks.invoke },
}));

describe("preload electron store bridge", () => {
  it("exposes a narrow API backed by the expected IPC channels", async () => {
    await import("./preload.js");

    expect(mocks.exposeInMainWorld).toHaveBeenCalledOnce();
    expect(mocks.exposeInMainWorld).toHaveBeenCalledWith(
      "electronStore",
      expect.objectContaining({
        getItem: expect.any(Function),
        setItem: expect.any(Function),
        removeItem: expect.any(Function),
      }),
    );

    const api = mocks.exposeInMainWorld.mock.calls[0]?.[1] as ElectronStoreApi;
    await api.getItem("sidebar");
    await api.setItem("sidebar", "value");
    await api.removeItem("sidebar");

    expect(mocks.invoke.mock.calls).toEqual([
      [electronStoreChannels.getItem, "sidebar"],
      [electronStoreChannels.setItem, "sidebar", "value"],
      [electronStoreChannels.removeItem, "sidebar"],
    ]);
  });
});
