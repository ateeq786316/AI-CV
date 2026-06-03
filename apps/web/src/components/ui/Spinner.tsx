export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-surface-sunken border-t-accent" />
      <p className="text-sm font-medium text-ink-muted">{label}</p>
    </div>
  );
}
