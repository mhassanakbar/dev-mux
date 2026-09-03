import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { useSettingsState } from "./state";

describe("settings state", () => {
  beforeAll(async () => {
    await useSettingsState.persist.rehydrate();
  });

  beforeEach(() => {
    useSettingsState.setState({ theme: "system" });
  });

  it("uses the system theme by default", () => {
    expect(useSettingsState.getState().theme).toBe("system");
  });

  it("updates the selected theme", () => {
    useSettingsState.getState().setTheme("dark");

    expect(useSettingsState.getState().theme).toBe("dark");
  });
});
