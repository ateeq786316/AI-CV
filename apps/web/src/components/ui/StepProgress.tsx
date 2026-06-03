interface Step {
  label: string;
  description?: string;
}

export function StepProgress({
  steps,
  current,
}: {
  steps: Step[];
  current: number;
}) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center gap-2">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step.label} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    done
                      ? "bg-emerald-600 text-white"
                      : active
                        ? "bg-accent text-white ring-4 ring-accent/20"
                        : "bg-surface-sunken text-ink-faint"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`mt-2 hidden text-xs font-semibold sm:block ${active ? "text-accent" : "text-ink-muted"}`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded ${done ? "bg-emerald-400" : "bg-surface-sunken"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
