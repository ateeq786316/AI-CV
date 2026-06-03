import { Card } from "./ui/Card";

export function ConfigError({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-6">
      <Card className="max-w-lg animate-slide-up">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Setup required
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
          Configuration missing
        </h1>
        {message && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {message}
          </p>
        )}
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-ink-muted">
          <li>Vercel → Environment Variables on project <strong>ai-cv-web</strong></li>
          <li>Add SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY</li>
          <li>Add GEMINI_API_KEY and ENCRYPTION_SECRET</li>
          <li>Enable Production, Preview, and Development for each</li>
          <li>Redeploy without cache</li>
        </ol>
      </Card>
    </div>
  );
}
