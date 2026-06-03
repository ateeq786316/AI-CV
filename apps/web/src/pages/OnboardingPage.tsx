import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { FileDropzone } from "../components/ui/FileDropzone";
import { PageHeader } from "../components/ui/PageHeader";
import { StepProgress } from "../components/ui/StepProgress";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../lib/api";
import { extractTextFromPdf } from "../lib/pdf";

const STEPS = [
  { label: "Upload", description: "PDF or paste" },
  { label: "Extract", description: "AI reads facts" },
  { label: "Review", description: "Edit profile" },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"paste" | "pdf">("paste");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const step = loading ? 1 : 0;

  const runExtract = async (raw: string, source: "paste" | "pdf") => {
    if (!raw.trim()) {
      setError("Add some CV content first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiClient.extract(raw, source);
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
    } finally {
      setLoading(false);
    }
  };

  const onFile = async (file: File) => {
    setError("");
    setLoading(true);
    try {
      const extracted = await extractTextFromPdf(file);
      setText(extracted);
      await runExtract(extracted, "pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF read failed");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 1 of 3"
        title="Build your master profile"
        description="This is your source of truth. We only reuse facts from here — never invented employers or skills."
      />

      {!user && (
        <Alert tone="warning" title="Sign in required">
          <Link to="/login" className="font-semibold underline">
            Sign in
          </Link>{" "}
          before uploading your CV.
        </Alert>
      )}

      <StepProgress steps={STEPS} current={step} />

      <div className="flex gap-2 rounded-2xl bg-surface-sunken/60 p-1">
        {(["paste", "pdf"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              tab === t
                ? "bg-surface-raised text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {t === "paste" ? "Paste text" : "Upload PDF"}
          </button>
        ))}
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {tab === "paste" ? (
        <Card>
          <label className="label-text">
            CV content
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={14}
              disabled={loading}
              placeholder="Paste your full CV: experience, skills, education, projects…"
              className="input-field font-mono text-xs leading-relaxed"
            />
          </label>
          <Button
            className="mt-4 w-full sm:w-auto"
            size="lg"
            loading={loading}
            disabled={!text.trim() || !user}
            onClick={() => runExtract(text, "paste")}
          >
            Extract & continue
          </Button>
        </Card>
      ) : (
        <FileDropzone onFile={onFile} disabled={!user} loading={loading} />
      )}

      <Alert tone="info" title="What happens next?">
        AI structures your CV into JSON. You can review and edit on the next screen before
        tailoring for jobs.
      </Alert>
    </div>
  );
}
