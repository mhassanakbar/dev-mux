import { Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { useParams } from "react-router";

import { useAppSidebarState } from "./AppSidebar/state";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Configuration() {
  const { workspaceId } = useParams();
  const workspace = useAppSidebarState((state) =>
    state.workspaces.find((item) => item.id === workspaceId),
  );
  const selectedService = workspace?.services.find(
    (service) => service.id === workspace.selectedServiceId,
  );

  return (
    <section aria-labelledby="configuration-heading" className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold" id="configuration-heading">Service configuration</h2>
        <p className="mt-1 text-xs text-muted-foreground">Define how the selected service starts and behaves.</p>
      </div>

      {!selectedService ? (
        <div className="grid min-h-64 place-items-center rounded-lg border bg-background p-8 text-center shadow-xs">
          <div>
            <SlidersHorizontal className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Select a service</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose a service from the sidebar to edit its configuration.
            </p>
          </div>
        </div>
      ) : (
      <form className="overflow-hidden rounded-lg border bg-background shadow-xs" key={selectedService.id}>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-medium">
            Service name
            <Input defaultValue={selectedService.name} placeholder="API" />
          </label>
          <label className="grid gap-1.5 text-xs font-medium">
            Working directory
            <Input placeholder="apps/api" />
          </label>
          <label className="grid gap-1.5 text-xs font-medium sm:col-span-2">
            Command
            <Input className="font-mono" placeholder="pnpm start" />
            <span className="font-normal text-muted-foreground">Runs relative to the workspace directory.</span>
          </label>
        </div>

        <div className="border-t p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium">Environment variables</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Values are stored locally with this workspace.</p>
            </div>
            <Button size="sm" type="button" variant="outline">
              <Plus data-icon="inline-start" />
              Add variable
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input aria-label="Environment variable name" className="font-mono" placeholder="NAME" />
            <Input aria-label="Environment variable value" className="font-mono" placeholder="value" />
            <Button aria-label="Remove environment variable" disabled size="icon" type="button" variant="ghost">
              <Trash2 />
            </Button>
          </div>
        </div>

        <label className="flex items-start gap-3 border-t p-5 text-xs">
          <input className="mt-0.5 size-4 accent-primary" type="checkbox" />
          <span>
            <span className="block font-medium">Restart automatically</span>
            <span className="mt-1 block text-muted-foreground">Restart this service after an unexpected exit.</span>
          </span>
        </label>

        <div className="flex justify-end gap-2 border-t bg-muted/30 px-5 py-3">
          <Button type="button" variant="outline">Discard</Button>
          <Button type="button">Save changes</Button>
        </div>
      </form>
      )}
    </section>
  );
}
