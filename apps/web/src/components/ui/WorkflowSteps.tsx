import { Link } from "react-router-dom";

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  href: string;
  done: boolean;
  current?: boolean;
}

export function WorkflowSteps({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.id}>
          <Link
            to={step.href}
            className={`group relative flex h-full flex-col rounded-2xl border p-4 transition-all ${
              step.current
                ? "border-accent bg-accent-light shadow-card ring-1 ring-accent/20"
                : step.done
                  ? "border-emerald-200/80 bg-emerald-50/50 hover:shadow-card"
                  : "border-surface-sunken bg-surface-raised hover:border-ink-faint/20 hover:shadow-card"
            }`}
          >
            <span
              className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step.done
                  ? "bg-emerald-600 text-white"
                  : step.current
                    ? "bg-accent text-white"
                    : "bg-surface-sunken text-ink-muted"
              }`}
            >
              {step.done ? "✓" : index + 1}
            </span>
            <span className="font-semibold text-ink group-hover:text-accent">
              {step.title}
            </span>
            <span className="mt-1 text-xs leading-relaxed text-ink-muted">
              {step.description}
            </span>
            {step.current && (
              <span className="mt-3 text-xs font-bold uppercase tracking-wide text-accent">
                Continue →
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
