import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export function Settings() {
  return (
    <div className="min-h-full bg-muted/20">
      <header className="flex h-14 items-center gap-3 border-b bg-background px-6">
        <Link
          aria-label="Back to workspaces"
          className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }))}
          to="/"
        >
          <ArrowLeft />
        </Link>
        <div>
          <h1 className="text-sm font-semibold">Settings</h1>
          <p className="text-xs text-muted-foreground">DevMux preferences</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 p-6">
        <section>
          <h2 className="mb-2 px-1 text-xs font-medium text-muted-foreground">Appearance</h2>
          <div className="divide-y rounded-lg border bg-background shadow-xs">
            <label className="flex items-center justify-between gap-4 p-4 text-sm">
              <span>
                <span className="block font-medium">Theme</span>
                <span className="mt-1 block text-xs text-muted-foreground">Choose how DevMux looks on this device.</span>
              </span>
              <select className="h-9 rounded-md border bg-background px-2 text-xs" defaultValue="system">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="flex items-center justify-between gap-4 p-4 text-sm">
              <span>
                <span className="block font-medium">Compact logs</span>
                <span className="mt-1 block text-xs text-muted-foreground">Use tighter line spacing in the log viewer.</span>
              </span>
              <input className="size-4 accent-primary" type="checkbox" />
            </label>
          </div>
        </section>

        <section>
          <h2 className="mb-2 px-1 text-xs font-medium text-muted-foreground">Application</h2>
          <div className="divide-y rounded-lg border bg-background shadow-xs">
            <label className="flex items-center justify-between gap-4 p-4 text-sm">
              <span>
                <span className="block font-medium">Reopen last workspace</span>
                <span className="mt-1 block text-xs text-muted-foreground">Return to your most recent workspace at launch.</span>
              </span>
              <input className="size-4 accent-primary" defaultChecked type="checkbox" />
            </label>
            <label className="flex items-center justify-between gap-4 p-4 text-sm">
              <span>
                <span className="block font-medium">Confirm before stopping all</span>
                <span className="mt-1 block text-xs text-muted-foreground">Ask before stopping every service in a workspace.</span>
              </span>
              <input className="size-4 accent-primary" defaultChecked type="checkbox" />
            </label>
          </div>
        </section>

        <p className="px-1 text-xs text-muted-foreground">DevMux 1.0.0</p>
      </main>
    </div>
  );
}
