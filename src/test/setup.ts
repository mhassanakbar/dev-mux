import { vi } from "vitest";

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: Object.assign(globalThis, {
    electronStore: {
      getItem: vi.fn().mockResolvedValue(null),
      setItem: vi.fn().mockResolvedValue(undefined),
      removeItem: vi.fn().mockResolvedValue(undefined),
    },
  }),
});
