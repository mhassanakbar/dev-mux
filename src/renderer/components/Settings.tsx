import { ArrowLeft, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";
import { useSettingsState, type Theme } from "./Settings/state";
import { Button, buttonVariants } from "./ui/button";

const themeOptions: { icon: LucideIcon; label: string; value: Theme }[] = [
  { icon: Sun, label: "Light", value: "light" },
  { icon: Moon, label: "Dark", value: "dark" },
  { icon: Monitor, label: "System", value: "system" },
];

export function Settings() {
  const theme = useSettingsState((state) => state.theme);
  const setTheme = useSettingsState((state) => state.setTheme);

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
            <div className="flex items-center justify-between gap-4 p-4 text-sm">
              <span>
                <span className="block font-medium">Theme</span>
                <span className="mt-1 block text-xs text-muted-foreground">Choose how DevMux looks on this device.</span>
              </span>
              <div aria-label="Theme" className="flex rounded-lg border bg-muted/50 p-1" role="group">
                {themeOptions.map(({ icon: Icon, label, value }) => (
                  <Button
                    aria-label={`Use ${label.toLowerCase()} theme`}
                    aria-pressed={theme === value}
                    className="gap-1.5 px-2.5"
                    key={value}
                    onClick={() => setTheme(value)}
                    size="sm"
                    type="button"
                    variant={theme === value ? "secondary" : "ghost"}
                  >
                    <Icon />
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
            </div>
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
