import { useEffect } from "react";
import { Play, RotateCw, Square } from "lucide-react";
import { NavLink, Outlet, useParams } from "react-router";

import { cn } from "@/lib/utils";
import { useAppSidebarState } from "./AppSidebar/state";
import { Button } from "./ui/button";

const sections = [
  { label: "Logs", path: "logs" },
  { label: "Metrics", path: "metrics" },
  { label: "Configuration", path: "configuration" },
];

function titleFromId(id = "Workspace") {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function Workspace() {
  const { workspaceId } = useParams();
  const workspaces = useAppSidebarState((state) => state.workspaces);
  const setSelectedWorkspaceId = useAppSidebarState((state) => state.setSelectedWorkspaceId);
  const workspace = workspaces.find((item) => item.id === workspaceId);
  const selectedService = workspace?.services.find(
    (service) => service.id === workspace.selectedServiceId,
  );

  useEffect(() => {
    if (workspaceId) setSelectedWorkspaceId(workspaceId);
  }, [setSelectedWorkspaceId, workspaceId]);

  return (
    <div className="flex min-h-full flex-col bg-muted/20">
      <header className="shrink-0 border-b bg-background">
        <div className="flex h-14 items-center justify-between gap-4 px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold">
                {workspace?.name ?? titleFromId(workspaceId)}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                Stopped
              </span>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {selectedService ? selectedService.name : "All services"}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Button size="sm" type="button">
              <Play data-icon="inline-start" />
              Start all
            </Button>
            <Button aria-label="Restart all services" size="icon-sm" type="button" variant="outline">
              <RotateCw />
            </Button>
            <Button aria-label="Stop all services" disabled size="icon-sm" type="button" variant="outline">
              <Square />
            </Button>
          </div>
        </div>

        <nav aria-label="Workspace sections" className="flex h-10 items-end gap-5 px-6">
          {sections.map((section) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "flex h-10 items-center border-b-2 border-transparent text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "border-foreground text-foreground",
                )
              }
              key={section.path}
              to={section.path}
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
