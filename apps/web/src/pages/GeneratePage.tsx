import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Spinner } from "../components/ui/Spinner";
import { StepProgress } from "../components/ui/StepProgress";
import { apiClient } from "../lib/api";
import { ROUTES } from "../routes";

const STEPS = [
  { label: "Master CV" },
  { label: "Job description" },
  { label: "Preview" },
];

const MODES = [
  {
    id: "safe",
    label: "Safe",
    desc: "Reorder and lightly rephrase. Best if you want minimal changes.",
  },
  {
    id: "balanced",
    label: "Balanced",
    desc: "Clearer bullets and skill priority. Recommended for most roles.",
  },
  {
    id: "ats_assist",
    label: "ATS assist",
    desc: "Stronger keyword alignment using only facts already on your CV.",
  },
] as const;

export function GeneratePage() {
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [mode, setMode] = useState<string>("balanced");
  const [fallback, setFallback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .getProfile()
      .then((r) => setHasProfile(Boolean(r.profile)))
      .catch(() => setHasProfile(false));
  }, []);

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
        setError("Some content failed validation. Check preview for details.");
      }
      navigate(ROUTES.preview(res.generationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed");
    } finally {
      setLoading(false);
    }
  };

  if (hasProfile === null) return <Spinner />;

  if (!hasProfile) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tailor your CV" description="You need a master profile first." />
        <Alert tone="warning" title="No master profile">
          <Link to="/onboarding" className="font-semibold text-accent underline">
            Add your CV
          </Link>{" "}
          before pasting a job description.
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 2 of 3"
        title="Match this job"
        description="Paste the full posting. We prioritize relevant skills and bullets without adding fake experience."
      />

      <StepProgress steps={STEPS} current={1} />

      <form onSubmit={onSubmit} className="space-y-6">
        {error && <Alert tone="error">{error}</Alert>}

        <Card>
          <label className="label-text">
            Target role (optional)
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="input-field"
              placeholder="e.g. Junior NestJS Backend Engineer"
            />
          </label>
        </Card>

        <Card>
          <label className="label-text">
            Job description
            <textarea
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
              className="input-field text-sm leading-relaxed"
              placeholder="Paste the entire job posting: requirements, responsibilities, tech stack…"
            />
          </label>
        </Card>

        <Card>
          <legend className="label-text mb-3">Optimization mode</legend>
          <div className="space-y-2">
            {MODES.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition-all ${
                  mode === m.id
                    ? "border-accent bg-accent-light ring-1 ring-accent/25"
                    : "border-surface-sunken hover:border-ink-faint/30"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value={m.id}
                  checked={mode === m.id}
                  onChange={() => setMode(m.id)}
                  className="mt-1 accent-accent"
                />
                <span>
                  <span className="font-semibold text-ink">{m.label}</span>
                  <span className="mt-0.5 block text-sm text-ink-muted">{m.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <label className="label-text">
            Vague posting? Pick a focus
            <select
              value={fallback}
              onChange={(e) => setFallback(e.target.value)}
              className="input-field"
            >
              <option value="">Auto from job text</option>
              <option value="backend">Backend emphasis</option>
              <option value="frontend">Frontend emphasis</option>
              <option value="fullstack">Full stack emphasis</option>
            </select>
          </label>
        </Card>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Generate preview
        </Button>
      </form>
    </div>
  );
}
