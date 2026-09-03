import eslint from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: [".vite/**", "coverage/**", "node_modules/**", "out/**"],
  },
  eslint.configs.recommended,
  ...typescriptEslint.configs["flat/recommended"],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  importPlugin.flatConfigs.electron,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"],
    rules: {
      "import/no-unresolved": "off",
    },
  },
];
