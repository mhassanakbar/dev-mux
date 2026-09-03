import { beforeEach, describe, expect, it, vi } from "vitest";

import { electronStoreChannels } from "../shared/electronStore";

type IpcHandler = (...args: unknown[]) => unknown;

const mocks = vi.hoisted(() => ({
  handlers: new Map<string, IpcHandler>(),
  getItem: vi.fn(),
  setItem: vi.fn(),
  deleteItem: vi.fn(),
}));

vi.mock("electron", () => ({
  ipcMain: {
    handle: vi.fn((channel: string, handler: IpcHandler) => {
      mocks.handlers.set(channel, handler);
    }),
  },
}));

vi.mock("electron-store", () => ({
  default: class ElectronStoreMock {
    get = mocks.getItem;
    set = mocks.setItem;
    delete = mocks.deleteItem;
  },
}));

import { registerElectronStoreHandlers } from "./electronStore";

describe("registerElectronStoreHandlers", () => {
  beforeEach(() => {
    mocks.handlers.clear();
    registerElectronStoreHandlers();
  });

  it("registers all storage channels", () => {
    expect([...mocks.handlers.keys()]).toEqual(Object.values(electronStoreChannels));
  });

  it("returns stored values and normalizes missing values to null", () => {
    const handler = mocks.handlers.get(electronStoreChannels.getItem);
    mocks.getItem.mockReturnValueOnce("value").mockReturnValueOnce(undefined);

    expect(handler?.({}, "key")).toBe("value");
    expect(handler?.({}, "missing")).toBeNull();
  });

  it("writes and removes values", () => {
    mocks.handlers.get(electronStoreChannels.setItem)?.({}, "key", "value");
    mocks.handlers.get(electronStoreChannels.removeItem)?.({}, "key");

    expect(mocks.setItem).toHaveBeenCalledWith("key", "value");
    expect(mocks.deleteItem).toHaveBeenCalledWith("key");
  });

  it("rejects non-string IPC input", () => {
    const getItem = mocks.handlers.get(electronStoreChannels.getItem);
    const setItem = mocks.handlers.get(electronStoreChannels.setItem);
    const removeItem = mocks.handlers.get(electronStoreChannels.removeItem);

    expect(() => getItem?.({}, 42)).toThrow("key must be a string");
    expect(() => setItem?.({}, "key", { json: true })).toThrow(
      "value must be a string",
    );
    expect(() => removeItem?.({}, null)).toThrow("key must be a string");
  });
});
