import { describe, expect, it } from "vitest";

import { resolveTheme } from "./ThemeProvider";

describe("theme resolution", () => {
  it("keeps an explicitly selected theme", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("uses the current system preference in system mode", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});
