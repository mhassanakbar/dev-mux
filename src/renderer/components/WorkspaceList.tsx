import { useState, type FormEvent } from "react";
import { ArrowRight, FolderKanban, FolderOpen, Plus, Settings as SettingsIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { cn } from "@/lib/utils";
import { useAppSidebarState } from "./AppSidebar/state";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";

export function WorkspaceList() {
  const navigate = useNavigate();
  const workspaces = useAppSidebarState((state) => state.workspaces);
  const addWorkspace = useAppSidebarState((state) => state.addWorkspace);
  const setSelectedWorkspaceId = useAppSidebarState((state) => state.setSelectedWorkspaceId);
  const [isCreating, setIsCreating] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [rootDirectory, setRootDirectory] = useState("");

  function createWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspaceName.trim()) return;

    const workspaceId = addWorkspace(workspaceName, rootDirectory);
    navigate(`/workspaces/${workspaceId}/logs`);
  }

  return (
    <div className="flex min-h-full flex-col bg-muted/20">
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-6">
        <div>
          <h1 className="text-sm font-semibold">Workspaces</h1>
          <p className="text-xs text-muted-foreground">Your local development environments</p>
        </div>
        <Link
          aria-label="Open settings"
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          to="/settings"
        >
          <SettingsIcon />
        </Link>
      </header>

      <main className={cn("flex-1 p-6", workspaces.length === 0 && !isCreating && "grid place-items-center")}>
        {workspaces.length === 0 && !isCreating ? (
          <section className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-5 grid size-14 place-items-center rounded-2xl border bg-background shadow-xs">
              <FolderOpen className="size-6 text-muted-foreground" />
            </div>
            <h2 className="font-heading text-lg font-semibold">Create your first workspace</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create a home for a project, then add the services that make up its local stack.
            </p>
            <Button className="mt-6" type="button" onClick={() => setIsCreating(true)}>
              <Plus data-icon="inline-start" />
              New workspace
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">Workspace configuration stays on this device.</p>
          </section>
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Choose a workspace</h2>
                <p className="mt-1 text-xs text-muted-foreground">Each workspace keeps its own services and configuration.</p>
              </div>
              {!isCreating && (
                <Button size="sm" type="button" onClick={() => setIsCreating(true)}>
                  <Plus data-icon="inline-start" />
                  New workspace
                </Button>
              )}
            </div>

            {isCreating && (
              <form className="mb-5 rounded-lg border bg-background p-5 shadow-xs" onSubmit={createWorkspace}>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold">New workspace</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Name the project and optionally record its local root directory.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-xs font-medium">
                    Name
                    <Input
                      autoFocus
                      placeholder="My application"
                      value={workspaceName}
                      onChange={(event) => setWorkspaceName(event.target.value)}
                    />
                  </label>
                  <label className="grid gap-1.5 text-xs font-medium">
                    Project directory
                    <Input
                      className="font-mono"
                      placeholder="C:\\projects\\my-application"
                      value={rootDirectory}
                      onChange={(event) => setRootDirectory(event.target.value)}
                    />
                  </label>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                  <Button disabled={!workspaceName.trim()} type="submit">Create workspace</Button>
                </div>
              </form>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => (
                <Link
                  className="group rounded-lg border bg-background p-4 shadow-xs transition-colors hover:border-foreground/20 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  key={workspace.id}
                  onClick={() => setSelectedWorkspaceId(workspace.id)}
                  to={`/workspaces/${workspace.id}/logs`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <FolderKanban className="size-4" />
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="mt-4 truncate text-sm font-semibold">{workspace.name}</h3>
                  <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
                    {workspace.rootDirectory || "Directory not set"}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {workspace.services.length} {workspace.services.length === 1 ? "service" : "services"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
