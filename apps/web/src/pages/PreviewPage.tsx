import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../lib/api";

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [optimized, setOptimized] = useState<unknown>(null);
  const [coverLetter, setCoverLetter] = useState("");
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
      .catch((e) => setError(e.message));
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
        const url = URL.createObjectURL(
          new Blob([blob], { type: "application/pdf" }),
        );
        setPdfUrl(url);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cv-${id.slice(0, 8)}.pdf`;
        a.click();
      } else if (res.pdfError) {
        setError(`PDF: ${res.pdfError}. Download .tex below.`);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Preview</h1>
        <Link to="/" className="text-sm text-brand-600 hover:underline">
          ← Dashboard
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="mb-2 font-semibold">Cover letter (1 paragraph)</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {coverLetter || "—"}
        </p>
      </section>

      <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="mb-2 font-semibold">Optimized CV (JSON)</h2>
        <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
          {optimized ? JSON.stringify(optimized, null, 2) : "Loading…"}
        </pre>
      </section>

      {pdfUrl && (
        <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-2 font-semibold">PDF preview</h2>
          <iframe title="CV PDF" src={pdfUrl} className="h-[600px] w-full rounded-lg border" />
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={approveAndDownload}
          disabled={compiling}
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {compiling ? "Compiling PDF…" : "Approve & download PDF"}
        </button>
        {tex && (
          <button
            type="button"
            onClick={downloadTex}
            className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium hover:bg-slate-50"
          >
            Download .tex
          </button>
        )}
        <Link
          to="/generate"
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium hover:bg-slate-50"
        >
          Regenerate
        </Link>
      </div>
    </div>
  );
}
