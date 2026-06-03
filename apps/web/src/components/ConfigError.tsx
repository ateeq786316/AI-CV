export function ConfigError({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <div className="max-w-lg rounded-2xl border border-surface-sunken bg-surface-raised p-8 shadow-card animate-slide-up">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Setup required
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
          App configuration missing
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          This deployment is missing required server environment variables. If you
          are the site owner, check your hosting dashboard and redeploy.
        </p>
        {message && import.meta.env.DEV && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {message}
          </p>
        )}
        <p className="mt-6 text-xs text-ink-faint">
          See <code className="rounded bg-surface-sunken px-1">README.md</code> and{" "}
          <code className="rounded bg-surface-sunken px-1">DEPLOY.md</code> in the
          repository for setup steps.
        </p>
      </div>
    </div>
  );
}
