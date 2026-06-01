import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient, type GenerationRow } from "../lib/api";

export function DashboardPage() {
  const [generations, setGenerations] = useState<GenerationRow[]>([]);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiClient.getProfile(), apiClient.listGenerations()])
      .then(([profileRes, genRes]) => {
        setHasProfile(Boolean(profileRes.profile));
        setGenerations(genRes.generations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Optimize your master CV for each job description.
        </p>
      </div>

      {!hasProfile && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-900">No master profile yet</p>
          <p className="mt-1 text-sm text-amber-800">
            Upload or paste your CV once — reuse it for every application.
          </p>
          <Link
            to="/onboarding"
            className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            Add your CV
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {hasProfile && (
          <Link
            to="/generate"
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
          >
            + New tailored CV
          </Link>
        )}
        <Link
          to="/profile"
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit master profile
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent generations</h2>
        {generations.length === 0 ? (
          <p className="text-sm text-slate-500">No generations yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl bg-white ring-1 ring-slate-200">
            {generations.map((g) => (
              <li key={g.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium text-slate-800">
                    {g.job_title || "Untitled role"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(g.created_at).toLocaleString()} · {g.status} ·{" "}
                    {g.optimization_mode}
                  </p>
                </div>
                <Link
                  to={`/preview/${g.id}`}
                  className="text-sm font-medium text-brand-600 hover:underline"
                >
                  Preview
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
