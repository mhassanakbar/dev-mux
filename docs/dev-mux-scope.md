# DevMux — Project Scope

## Overview

DevMux is a cross-platform desktop application for running and monitoring the services that make up a local development environment.

Instead of opening several terminals and manually starting each process, a developer creates a workspace, defines its services, and starts or stops the entire stack from one place.

Example workspace:

| Service | Directory | Command |
| --- | --- | --- |
| Web | `apps/web` | `pnpm dev` |
| API | `apps/api` | `pnpm start` |
| Worker | `apps/api` | `pnpm worker` |
| Database | Project root | `docker compose up postgres` |

## Goals

- Make local multi-service projects easier to start and monitor.
- Provide one searchable view for process output.
- Make process state, failures, and health visible.
- Work consistently on Windows, macOS, and Linux.
- Demonstrate production-quality Electron architecture and packaging.

## Target Users

- Developers working on monorepos
- Full-stack developers running frontend, backend, workers, and databases
- Small teams that want a shared local-development configuration
- Developers who prefer a graphical tool over several terminal windows

## Core User Flow

1. The user selects a project directory.
2. DevMux creates a workspace for that project.
3. The user adds one or more services.
4. For each service, they provide a name, working directory, and command.
5. The user starts an individual service or the entire workspace.
6. DevMux displays live logs and current service status.
7. The user stops, restarts, or edits services as needed.
8. DevMux restores the workspace configuration the next time it opens.

## MVP Scope

### Workspace Management

- Create a workspace by selecting a local directory.
- Rename and delete a workspace.
- Persist workspace configuration locally.
- Reopen the last selected workspace when the app starts.

### Service Management

- Add, edit, and remove services.
- Configure a service name, working directory, command, and arguments.
- Start, stop, and restart individual services.
- Start or stop every service in a workspace.
- Display service states: stopped, starting, running, stopping, crashed, and failed.

### Logs

- Stream `stdout` and `stderr` from each process.
- View logs for one service or all services.
- Use different colours for each service in the combined log view.
- Preserve ANSI terminal colours where practical.
- Clear, pause, copy, and search visible logs.
- Keep a bounded in-memory log history to prevent excessive memory use.

### Application Interface

- Workspace and service navigation in a persistent sidebar.
- Header with the selected service's state and controls.
- Detail sections for logs, metrics, and configuration.
- Dark-first, compact interface suitable for a developer tool.
- Resizable sidebar and log panels.
- Keyboard-accessible controls.

### Local Persistence

- Store workspaces, services, preferences, and window state locally.
- Store configuration in SQLite or a small local configuration store.
- Do not require an account or remote backend for the MVP.

## Navigation

The renderer is a single-page React application using hash-based routing so it works from both the Vite development server and packaged Electron files.

Suggested routes:

```text
/
/workspaces/:workspaceId/logs
/workspaces/:workspaceId/metrics
/workspaces/:workspaceId/configuration
/settings
```

The selected service can be stored in the query string:

```text
#/workspaces/my-project/logs?service=api
```

Routes represent screens and persistent tabs. Temporary interface state, such as dialogs, filters, and panel sizes, should remain in component state or Zustand.

## Technical Architecture

### Renderer Process

The renderer owns the user interface only.

- React
- TypeScript
- shadcn/ui and Tailwind CSS
- React Router
- Zustand
- `react-resizable-panels`
- `xterm.js` or an ANSI-compatible log renderer

The renderer must not access Node.js, the filesystem, or child processes directly.

### Preload Script

The preload script exposes a small, typed API through Electron's context bridge.

Example responsibilities:

- Select a project directory.
- Create and update workspaces.
- Start, stop, and restart services.
- Subscribe to process logs and status changes.
- Read application preferences.

### Main Process

The Electron main process owns privileged operations.

- Create and manage application windows.
- Launch and terminate child processes.
- Capture process output.
- Manage process state.
- Read and write local configuration.
- Handle clean application shutdown.
- Send validated events to the renderer.

### Process Management

Services should initially run with Node's `child_process.spawn` using an explicit executable, arguments, working directory, and environment.

DevMux must:

- Track the process ID and current state of each service.
- Batch log events before sending them to the renderer.
- Stop the complete process tree where possible.
- Detect unexpected exits and mark the service as crashed.
- Attempt graceful shutdown before forcing termination.
- Shut down managed processes when DevMux exits, unless the user chooses otherwise.

Interactive terminal support through `node-pty` can be added after the basic process runner is stable.

## Suggested Data Model

```ts
type Workspace = {
  id: string;
  name: string;
  rootDirectory: string;
  services: Service[];
};

type Service = {
  id: string;
  name: string;
  relativeDirectory: string;
  executable: string;
  args: string[];
  environment: Record<string, string>;
  healthCheckUrl?: string;
  autoRestart: boolean;
};
```

Runtime process information should remain separate from persisted configuration.

## Security Requirements

- Enable context isolation.
- Disable Node integration in the renderer.
- Expose only a narrow API through the preload script.
- Validate all IPC input in the main process.
- Treat configured commands as trusted local developer input.
- Never execute commands received from web content.
- Restrict navigation and prevent unexpected external pages from loading inside the app.
- Redact common secrets before exporting logs.

## MVP Non-Goals

The first version will not include:

- User accounts or cloud synchronization
- Team collaboration
- Remote process management
- A full terminal emulator
- Plugin support
- Automatic project detection
- Docker management beyond running configured commands
- Advanced historical metrics
- Paid plans or billing

## Features After the MVP

- Detect commands from `package.json`, `docker-compose.yml`, `Procfile`, `Gemfile`, and monorepo configuration.
- Import and export a shareable `devmux.yml` file.
- HTTP and port health checks.
- CPU, memory, port, and uptime metrics.
- Automatic restart policies.
- Environment profiles such as development, test, and staging.
- Port-conflict detection.
- Native system notifications.
- System-tray controls.
- Command palette and global shortcuts.
- Interactive processes through `node-pty`.
- Git branch and repository status.
- Windows, macOS, and Linux auto-updates.

## Development Milestones

### Milestone 1 — Application Shell

- Electron Forge and Vite setup
- React renderer
- shadcn/ui styling
- Router and persistent application layout
- Secure preload bridge

### Milestone 2 — Workspace Configuration

- Directory picker
- Workspace creation
- Service form
- Local persistence

### Milestone 3 — Process Runner

- Start, stop, and restart commands
- Process-state tracking
- Graceful shutdown
- Cross-platform process-tree handling

### Milestone 4 — Log Viewer

- Live output streaming
- Per-service and combined logs
- Search, pause, clear, and copy
- Log batching and bounded history

### Milestone 5 — Release

- Error handling and empty states
- Unit and end-to-end tests
- Windows, macOS, and Linux packaging
- GitHub Actions release workflow
- README, screenshots, and demonstration video

## Definition of Done for Version 1

Version 1 is complete when a user can install DevMux, select a project, configure several services, start and stop them reliably, inspect their combined or individual logs, close and reopen the application without losing configuration, and use the application on at least Windows and one Unix-based platform.
