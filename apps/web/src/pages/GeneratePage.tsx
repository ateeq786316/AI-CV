import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/api";

const MODES = [
  { id: "safe", label: "Safe", desc: "Reorder + light rephrase" },
  { id: "balanced", label: "Balanced", desc: "Clearer bullets + skill priority" },
  { id: "ats_assist", label: "ATS assist", desc: "Stronger keyword alignment" },
] as const;

export function GeneratePage() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [mode, setMode] = useState<string>("balanced");
  const [fallback, setFallback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiClient.optimize({
        jobTitle: jobTitle || undefined,
        jobDescription,
        mode,
        fallbackProfile: fallback || undefined,
      });
      if (res.validationErrors?.length) {
        setError(
          `Validation issues: ${JSON.stringify(res.validationErrors)}. Check preview.`,
        );
      }
      navigate(`/preview/${res.generationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">New tailored CV</h1>
      <form onSubmit={onSubmit} className="space-y-5 rounded-xl bg-white p-6 ring-1 ring-slate-200">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <label className="block text-sm font-medium">
          Job title (optional)
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Junior NestJS Backend Engineer"
          />
        </label>
        <label className="block text-sm font-medium">
          Job description
          <textarea
            required
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={12}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Paste the full job posting…"
          />
        </label>
        <fieldset>
          <legend className="text-sm font-medium">Optimization mode</legend>
          <div className="mt-2 space-y-2">
            {MODES.map((m) => (
              <label
                key={m.id}
                className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
              >
                <input
                  type="radio"
                  name="mode"
                  value={m.id}
                  checked={mode === m.id}
                  onChange={() => setMode(m.id)}
                />
                <span>
                  <span className="font-medium">{m.label}</span>
                  <span className="block text-xs text-slate-500">{m.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-medium">
          Weak JD fallback (optional)
          <select
            value={fallback}
            onChange={(e) => setFallback(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">None</option>
            <option value="backend">Backend focus</option>
            <option value="frontend">Frontend focus</option>
            <option value="fullstack">Full stack focus</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Optimizing with AI…" : "Generate preview"}
        </button>
      </form>
    </div>
  );
}
