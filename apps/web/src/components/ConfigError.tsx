export function ConfigError({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="max-w-lg rounded-xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Configuration required</h1>
        {message && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
          </p>
        )}
        <p className="mt-3 text-sm text-slate-600">
          Add these in <strong>Vercel → Settings → Environment Variables</strong>{" "}
          (all environments), then <strong>Redeploy</strong> without cache:
        </p>
        <ul className="mt-4 space-y-2 font-mono text-xs text-slate-800">
          <li>
            <strong>SUPABASE_URL</strong> = https://ogxuuoxicvszwpatxoap.supabase.co
          </li>
          <li>
            <strong>SUPABASE_ANON_KEY</strong> = anon public key (Supabase → API)
          </li>
          <li>
            <strong>SUPABASE_SERVICE_ROLE_KEY</strong> = service_role (secret)
          </li>
          <li>
            <strong>GEMINI_API_KEY</strong> = your Gemini key
          </li>
          <li>
            <strong>ENCRYPTION_SECRET</strong> = random 32+ chars
          </li>
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          Optional: <code className="rounded bg-slate-100 px-1">VITE_SUPABASE_*</code> for
          local dev only. Production loads config from{" "}
          <code className="rounded bg-slate-100 px-1">/api/config</code> at runtime.
        </p>
      </div>
    </div>
  );
}
