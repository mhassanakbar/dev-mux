import { Activity, Clock3, Cpu, MemoryStick } from "lucide-react";

const metrics = [
  { label: "CPU", value: "—", icon: Cpu },
  { label: "Memory", value: "—", icon: MemoryStick },
  { label: "Uptime", value: "—", icon: Clock3 },
];

export function Metrics() {
  return (
    <section aria-labelledby="metrics-heading" className="p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold" id="metrics-heading">Runtime metrics</h2>
        <p className="mt-1 text-xs text-muted-foreground">Current resource usage for the selected service.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map(({ icon: Icon, label, value }) => (
          <article className="rounded-lg border bg-background p-4 shadow-xs" key={label}>
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">{label}</span>
              <Icon className="size-4" />
            </div>
            <p className="mt-5 font-mono text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Waiting for service</p>
          </article>
        ))}
      </div>

      <div className="mt-3 grid min-h-64 place-items-center rounded-lg border bg-background p-8 shadow-xs">
        <div className="text-center">
          <Activity className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No runtime data</p>
          <p className="mt-1 text-xs text-muted-foreground">Metrics appear while a service is running.</p>
        </div>
      </div>
    </section>
  );
}
