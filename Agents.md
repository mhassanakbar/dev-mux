# Agent notes

DevMux is an open-source, GUI-first alternative to tmux for running and monitoring local development services.

## Process boundaries

- `src/main` owns Electron lifecycle, windows, persistence, and other privileged work.
- `src/preload` exposes narrow APIs with `contextBridge`; never expose `ipcRenderer` itself.
- `src/shared` is the source of truth for IPC channel names and cross-process types. Validate IPC input in the main process.
- `src/renderer` stays browser-only and reaches desktop capabilities through typed `window` APIs.

## Project conventions

- Keep hash-based routing so routes work from both Vite and packaged files.
- Reuse the `@/` alias, Tailwind v4 tokens in `index.css`, and components in `src/renderer/components/ui`.
- Preserve the persistence path: Zustand `persist` → `electronJsonStorage` → preload bridge → validated main-process handler → `electron-store`.
- Preserve Electron Forge/Vite packaging and security fuses unless the task explicitly changes them.

## Workflow

Use pnpm and keep patches focused. Check `package.json` for available scripts, run the smallest relevant checks, and report anything that could not run. Never edit `.vite`, `out`, or `node_modules`.
