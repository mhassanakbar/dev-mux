import { useLayoutEffect, type ReactNode } from "react";

import { useSettingsState, type Theme } from "./Settings/state";

const systemThemeQuery = "(prefers-color-scheme: dark)";

export function resolveTheme(theme: Theme, systemPrefersDark: boolean) {
  return theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;
}

export function applyTheme(theme: Theme, systemPrefersDark: boolean) {
  const resolvedTheme = resolveTheme(theme, systemPrefersDark);

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsState((state) => state.theme);

  useLayoutEffect(() => {
    const systemTheme = window.matchMedia(systemThemeQuery);
    const updateTheme = () => applyTheme(theme, systemTheme.matches);

    updateTheme();

    if (theme !== "system") return;

    systemTheme.addEventListener("change", updateTheme);
    return () => systemTheme.removeEventListener("change", updateTheme);
  }, [theme]);

  return children;
}
