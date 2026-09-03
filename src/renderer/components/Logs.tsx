import { Clipboard, Eraser, Pause, Search, SquareTerminal } from "lucide-react";
import { useParams } from "react-router";

import { useAppSidebarState } from "./AppSidebar/state";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Logs() {
  const { workspaceId } = useParams();
  const workspace = useAppSidebarState((state) =>
    state.workspaces.find((item) => item.id === workspaceId),
  );
  const setSelectedServiceId = useAppSidebarState((state) => state.setSelectedServiceId);

  return (
    <section aria-labelledby="logs-heading" className="flex h-full min-h-[30rem] flex-col p-4">
      <h2 className="sr-only" id="logs-heading">Service logs</h2>

      <div className="flex flex-wrap items-center gap-2 rounded-t-lg border bg-background p-2">
        <select
          aria-label="Filter logs by service"
          className="h-8 rounded-md border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={workspace?.selectedServiceId ?? "all"}
          onChange={(event) => {
            if (!workspaceId) return;
            setSelectedServiceId(workspaceId, event.target.value === "all" ? null : event.target.value);
          }}
        >
          <option value="all">All services</option>
          {workspace?.services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
        <div className="relative min-w-48 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search logs" className="h-8 pl-8 text-xs" placeholder="Search logs" />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" type="button" variant="ghost">
            <Pause data-icon="inline-start" />
            Pause
          </Button>
          <Button size="sm" type="button" variant="ghost">
            <Eraser data-icon="inline-start" />
            Clear
          </Button>
          <Button aria-label="Copy visible logs" size="icon-sm" type="button" variant="ghost">
            <Clipboard />
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 place-items-center rounded-b-lg border border-t-0 bg-[#111214] p-8 text-slate-300 shadow-inner">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-4 grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5">
            <SquareTerminal className="size-5 text-slate-400" />
          </div>
          <p className="font-mono text-sm font-medium text-slate-200">No output yet</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Start a service to stream its stdout and stderr here.
          </p>
        </div>
      </div>
    </section>
  );
}
