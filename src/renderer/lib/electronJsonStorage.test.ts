import { beforeEach, describe, expect, it, vi } from "vitest";

import { electronJsonStorage } from "./electronJsonStorage";

describe("electronJsonStorage", () => {
  beforeEach(() => {
    vi.mocked(window.electronStore.getItem).mockResolvedValue("stored-value");
  });

  it("forwards reads to the preload bridge", async () => {
    await expect(electronJsonStorage.getItem("sidebar")).resolves.toBe(
      "stored-value",
    );
    expect(window.electronStore.getItem).toHaveBeenCalledWith("sidebar");
  });

  it("forwards writes and removals to the preload bridge", async () => {
    await electronJsonStorage.setItem("sidebar", "json-value");
    await electronJsonStorage.removeItem("sidebar");

    expect(window.electronStore.setItem).toHaveBeenCalledWith(
      "sidebar",
      "json-value",
    );
    expect(window.electronStore.removeItem).toHaveBeenCalledWith("sidebar");
  });
});
