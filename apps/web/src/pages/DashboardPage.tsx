import { Link } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Spinner } from "../components/ui/Spinner";
import { WorkflowSteps } from "../components/ui/WorkflowSteps";
import { useWorkflowSteps } from "../hooks/useWorkflowSteps";
import { apiClient, type GenerationRow } from "../lib/api";
import { useEffect, useState } from "react";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    preview: "bg-accent-light text-accent",
    compiled: "bg-emerald-100 text-emerald-800",
    failed: "bg-red-100 text-red-800",
  };
  return map[status] ?? "bg-surface-sunken text-ink-muted";
}

export function DashboardPage() {
  const { steps, hasProfile, loading } = useWorkflowSteps();
  const [generations, setGenerations] = useState<GenerationRow[]>([]);

  useEffect(() => {
    apiClient
      .listGenerations()
      .then((r) => setGenerations(r.generations))
      .catch(() => {});
  }, []);

  if (loading) return <Spinner label="Loading your workspace…" />;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Workspace"
        title="Welcome back"
        description="Follow the steps below to go from master CV to a job-ready PDF in minutes."
        action={
          hasProfile ? (
            <Link to="/generate">
              <Button size="lg">Tailor new CV</Button>
            </Link>
          ) : (
            <Link to="/onboarding">
              <Button size="lg">Get started</Button>
            </Link>
          )
        }
      />

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-muted">
          Your path
        </h2>
        <WorkflowSteps steps={steps} />
      </section>

      {!hasProfile && (
        <Alert tone="warning" title="Start here">
          You need a master profile before tailoring. Upload or paste your CV — we only
          extract facts you already have.
        </Alert>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-display text-lg font-semibold text-ink">How it works</h3>
          <ol className="mt-4 space-y-4 text-sm text-ink-muted">
            <li className="flex gap-3">
              <span className="font-bold text-accent">1</span>
              <span>
                <strong className="text-ink">Master CV</strong> — stored securely; reused
                for every application.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent">2</span>
              <span>
                <strong className="text-ink">Job match</strong> — AI reorders skills and
                bullets; never invents experience.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent">3</span>
              <span>
                <strong className="text-ink">Export</strong> — preview, then PDF or
                Overleaf `.tex` if compile fails.
              </span>
            </li>
          </ol>
        </Card>

        <Card>
          <h3 className="font-display text-lg font-semibold text-ink">Tips</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li>· Paste text if PDF extraction looks wrong</li>
            <li>· Use <strong className="text-ink">Balanced</strong> mode first</li>
            <li>· Add your Gemini key in Settings if quota runs out</li>
            <li>· PDF compile may fail — download `.tex` for Overleaf</li>
          </ul>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Recent tailored CVs</h2>
          {hasProfile && (
            <Link to="/generate" className="text-sm font-semibold text-accent hover:underline">
              + New
            </Link>
          )}
        </div>
        {generations.length === 0 ? (
          <Card className="text-center">
            <p className="text-ink-muted">No tailored CVs yet.</p>
            {hasProfile && (
              <Link to="/generate" className="mt-4 inline-block">
                <Button>Create your first</Button>
              </Link>
            )}
          </Card>
        ) : (
          <ul className="space-y-2">
            {generations.map((g) => (
              <li key={g.id}>
                <Link
                  to={`/preview/${g.id}`}
                  className="flex items-center justify-between rounded-2xl border border-surface-sunken/80 bg-surface-raised p-4 shadow-card transition-shadow hover:shadow-cardHover"
                >
                  <div>
                    <p className="font-semibold text-ink">
                      {g.job_title || "Untitled role"}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {new Date(g.created_at).toLocaleString()} · {g.optimization_mode}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(g.status)}`}
                  >
                    {g.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
