# DevMux

**A GUI-first alternative to tmux for local development environments.**

DevMux is an open-source, cross-platform desktop app for running and monitoring the services that make up a local development stack. Group a web app, API, workers, databases, and supporting processes into one workspace, then control the whole stack without juggling terminal windows.

Where tmux multiplexes terminal sessions, DevMux organizes long-running development services around a visual workflow: persistent configuration, explicit process states, searchable output, and controls that are approachable without terminal key bindings.

## Why DevMux?

Modern projects often require several commands to be running at once. Remembering directories, startup order, and which terminal owns which process adds friction every time a project starts.

DevMux gives each project a durable home:

- Start, stop, or restart one service or the entire workspace
- See which services are starting, running, stopping, or have crashed
- Read individual or combined `stdout` and `stderr` streams
- Search, pause, clear, and copy logs from one interface
- Restore local workspace configuration between sessions
- Use the same workflow on Windows, macOS, and Linux

A workspace can describe any command-driven stack:

| Service | Working directory | Command |
| --- | --- | --- |
| Web | `apps/web` | `pnpm dev` |
| API | `apps/api` | `pnpm start` |
| Worker | `apps/api` | `pnpm worker` |
| Database | project root | `docker compose up postgres` |

## Architecture

DevMux follows Electron's process and security model instead of giving the UI direct access to the operating system.

```text
React renderer
  └─ typed window API
       └─ isolated preload bridge
            └─ validated IPC handlers
                 ├─ local persistence
                 └─ process supervision
```

- The **renderer** owns the React interface and browser-safe state.
- The **preload script** exposes a narrow, typed API through `contextBridge`.
- The **main process** owns windows, persistence, child processes, and application shutdown.
- Shared TypeScript contracts keep IPC calls consistent across process boundaries.

Security-sensitive defaults include context isolation, no Node.js integration in the renderer, validated IPC input, ASAR packaging, cookie encryption, restricted Node flags, and Electron production fuses.

## Technology

| Layer | Tools |
| --- | --- |
| Desktop runtime | Electron 44, Electron Forge |
| Build tooling | Vite 8, TypeScript |
| Renderer | React 19, React Router, Zustand |
| UI | Tailwind CSS 4, shadcn/ui, Base UI, Lucide |
| Persistence | `electron-store` behind typed IPC |
| Distribution | Squirrel, ZIP, DEB, and RPM makers |

## Run locally

Prerequisites: a current Node.js LTS release and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm start
```

Build for the current platform:

```bash
pnpm package    # create an unpacked application
pnpm make       # create distributable artifacts
```

Run the local quality checks:

```bash
pnpm lint
pnpm test
```

Husky runs both checks before each push. The hook is installed automatically by
`pnpm install` through the package `prepare` script.

## Repository structure

```text
src/
├─ main/       Electron lifecycle and privileged capabilities
├─ preload/    Isolated, typed bridge exposed to the renderer
├─ renderer/   React application, routing, state, and components
└─ shared/     Contracts shared across Electron process boundaries
```

## Contributing

DevMux is built in the open. Bug reports, focused pull requests, and product feedback are welcome.

## License

MIT
