import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Spinner } from "../components/ui/Spinner";
import { StepProgress } from "../components/ui/StepProgress";
import { apiClient } from "../lib/api";
import { ROUTES } from "../routes";

const STEPS = [{ label: "Master CV" }, { label: "Job" }, { label: "Preview & export" }];

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<"letter" | "cv" | "pdf">("letter");
  const [optimized, setOptimized] = useState<unknown>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [compiling, setCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [tex, setTex] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    apiClient
      .getGeneration(id)
      .then((res) => {
        setOptimized(res.generation.optimized_data);
        setCoverLetter(res.generation.cover_letter ?? "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const approveAndDownload = async () => {
    if (!id) return;
    setCompiling(true);
    setError("");
    try {
      const res = await apiClient.compile(id);
      setTex(res.tex);
      if (res.pdfBase64) {
        const blob = Uint8Array.from(atob(res.pdfBase64), (c) => c.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        setPdfUrl(url);
        setTab("pdf");
        const a = document.createElement("a");
        a.href = url;
        a.download = `cv-${id.slice(0, 8)}.pdf`;
        a.click();
      } else if (res.pdfError) {
        setError(
          `PDF compile unavailable: ${res.pdfError} Use Download .tex and compile in Overleaf.`,
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compile failed");
    } finally {
      setCompiling(false);
    }
  };

  const downloadTex = () => {
    if (!tex) return;
    const blob = new Blob([tex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv.tex";
    a.click();
  };

  if (loading) return <Spinner label="Loading preview…" />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 3 of 3"
        title="Review & export"
        description="Read the cover letter and tailored content. When satisfied, download your PDF."
        action={
          <Link to={ROUTES.dashboard}>
            <Button variant="secondary">Dashboard</Button>
          </Link>
        }
      />

      <StepProgress steps={STEPS} current={2} />

      {error && <Alert tone="error">{error}</Alert>}

      <div className="flex gap-1 rounded-2xl bg-surface-sunken/60 p-1">
        {(
          [
            ["letter", "Cover letter"],
            ["cv", "CV data"],
            ["pdf", "PDF"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
              tab === key ? "bg-surface-raised shadow-sm text-ink" : "text-ink-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "letter" && (
        <Card>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
            {coverLetter || "No cover letter generated."}
          </p>
        </Card>
      )}

      {tab === "cv" && (
        <Card padding="none">
          <pre className="max-h-[28rem] overflow-auto rounded-2xl bg-ink p-5 text-xs leading-relaxed text-surface-sunken">
            {optimized ? JSON.stringify(optimized, null, 2) : "—"}
          </pre>
        </Card>
      )}

      {tab === "pdf" && pdfUrl && (
        <Card padding="none">
          <iframe
            title="CV PDF preview"
            src={pdfUrl}
            className="h-[32rem] w-full rounded-2xl border-0"
          />
        </Card>
      )}

      <Card className="border-accent/20 bg-accent-light/30">
        <h3 className="font-semibold text-ink">Ready to export?</h3>
        <p className="prose-muted mt-1">
          PDF uses our LaTeX template. If compile fails, download `.tex` and open in
          Overleaf — same result, guaranteed fonts.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button size="lg" loading={compiling} onClick={approveAndDownload}>
            Download PDF
          </Button>
          {tex && (
            <Button variant="secondary" size="lg" onClick={downloadTex}>
              Download .tex
            </Button>
          )}
          <Link to={ROUTES.generate}>
            <Button variant="ghost" size="lg">
              Try another job
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
