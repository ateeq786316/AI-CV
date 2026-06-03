import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../lib/api";
import { extractTextFromPdf } from "../lib/pdf";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"paste" | "pdf">("paste");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runExtract = async (raw: string, source: "paste" | "pdf") => {
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

  const onPasteSubmit = () => runExtract(text, "paste");

  const onFile = async (file: File) => {
    try {
      const extracted = await extractTextFromPdf(file);
      setText(extracted);
      await runExtract(extracted, "pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF read failed");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Add your CV</h1>
      {!user && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          You must be{" "}
          <Link to="/login" className="font-medium underline">
            signed in
          </Link>{" "}
          before uploading.
        </p>
      )}
      <p className="text-slate-600">
        Paste text or upload a PDF. We extract structured data once — you won&apos;t
        need to upload again for each job.
      </p>

      <div className="flex gap-2">
        {(["paste", "pdf"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === t
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {t === "paste" ? "Paste text" : "Upload PDF"}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {tab === "paste" ? (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={16}
            placeholder="Paste your full CV text here…"
            className="w-full rounded-xl border border-slate-300 p-3 font-mono text-sm"
          />
          <button
            type="button"
            disabled={loading || !text.trim()}
            onClick={onPasteSubmit}
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Extracting with AI…" : "Extract & save"}
          </button>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
          <input
            type="file"
            accept="application/pdf"
            disabled={loading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
            className="text-sm"
          />
          <p className="mt-2 text-xs text-slate-500">PDF only for MVP</p>
        </div>
      )}
    </div>
  );
}
