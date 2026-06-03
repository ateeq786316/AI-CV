import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-surface-sunken/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl animate-slide-up">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description && <p className="prose-muted mt-2">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
