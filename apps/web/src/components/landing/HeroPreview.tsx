/** Decorative product mock — pure CSS, no screenshots */
export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-ink/5 blur-3xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl border border-surface-sunken/80 bg-surface-raised shadow-cardHover ring-1 ring-ink/5">
        <div className="flex items-center gap-2 border-b border-surface-sunken bg-surface px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-xs font-medium text-ink-faint">cv-tailor — preview</span>
        </div>

        <div className="grid gap-0 sm:grid-cols-5">
          <div className="border-b border-surface-sunken bg-sidebar p-4 sm:col-span-2 sm:border-b-0 sm:border-r">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-text">
              Job description
            </p>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-full rounded bg-sidebar-hover" />
              <div className="h-2 w-[90%] rounded bg-sidebar-hover" />
              <div className="h-2 w-[75%] rounded bg-sidebar-hover" />
              <div className="mt-4 h-2 w-[60%] rounded bg-accent/40" />
              <div className="h-2 w-[85%] rounded bg-sidebar-hover" />
            </div>
            <div className="mt-5 inline-flex rounded-lg bg-accent px-2.5 py-1 text-[10px] font-semibold text-white">
              Optimizing…
            </div>
          </div>

          <div className="bg-white p-5 sm:col-span-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-lg font-semibold text-ink">Ateeq Ahmed</p>
                <p className="text-xs text-ink-muted">Full-stack · React · Node</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                Balanced
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-1.5 w-full rounded bg-surface-sunken" />
              <div className="h-1.5 w-[92%] rounded bg-surface-sunken" />
              <div className="h-1.5 w-[88%] rounded bg-accent/25" />
              <div className="h-1.5 w-[95%] rounded bg-surface-sunken" />
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-ink-muted">
              Cover letter ready · PDF export · Truth-lock verified
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-4 hidden rounded-xl border border-surface-sunken bg-surface-raised px-4 py-3 shadow-card sm:block">
        <p className="text-xs font-semibold text-ink">No invented skills</p>
        <p className="text-[10px] text-ink-muted">Facts from your master CV only</p>
      </div>
    </div>
  );
}
