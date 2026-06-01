export function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="max-w-lg rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Configuration required</h1>
        <p className="mt-3 text-sm text-slate-600">
          Supabase environment variables were not included in this build. Vite
          only reads variables that start with{" "}
          <code className="rounded bg-slate-100 px-1">VITE_</code> at{" "}
          <strong>build time</strong>.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Vercel → <strong>Project → Settings → Environment Variables</strong>
          </li>
          <li>
            Add <code className="rounded bg-slate-100 px-1">VITE_SUPABASE_URL</code>{" "}
            = <code className="text-xs">https://ogxuuoxicvszwpatxoap.supabase.co</code>
          </li>
          <li>
            Add <code className="rounded bg-slate-100 px-1">VITE_SUPABASE_ANON_KEY</code>{" "}
            = your Supabase <strong>anon public</strong> key
          </li>
          <li>
            Also add server vars: <code className="rounded bg-slate-100 px-1">SUPABASE_URL</code>,{" "}
            <code className="rounded bg-slate-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code>,{" "}
            <code className="rounded bg-slate-100 px-1">GEMINI_API_KEY</code>,{" "}
            <code className="rounded bg-slate-100 px-1">ENCRYPTION_SECRET</code>
          </li>
          <li>
            <strong>Redeploy</strong> (Deployments → ⋯ → Redeploy, clear cache)
          </li>
        </ol>
        <p className="mt-4 text-xs text-slate-500">
          Local dev: copy <code className="rounded bg-slate-100 px-1">.env.example</code> to{" "}
          <code className="rounded bg-slate-100 px-1">.env.local</code> in{" "}
          <code className="rounded bg-slate-100 px-1">apps/web</code>.
        </p>
      </div>
    </div>
  );
}
