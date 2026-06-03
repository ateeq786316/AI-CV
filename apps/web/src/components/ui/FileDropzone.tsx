import { useCallback, useState } from "react";
export function FileDropzone({
  onFile,
  disabled,
  loading,
}: {
  onFile: (file: File) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [drag, setDrag] = useState(false);

  const handle = useCallback(
    (file: File | undefined) => {
      if (!file || file.type !== "application/pdf") return;
      onFile(file);
    },
    [onFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handle(e.dataTransfer.files[0]);
      }}
      className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
        drag
          ? "border-accent bg-accent-light"
          : "border-surface-sunken bg-surface hover:border-accent/40"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light text-2xl">
        📄
      </div>
      <p className="font-semibold text-ink">Drop your PDF here</p>
      <p className="prose-muted mt-1">or choose a file from your computer</p>
      <label className="mt-6 inline-block">
        <input
          type="file"
          accept="application/pdf"
          disabled={disabled || loading}
          className="sr-only"
          onChange={(e) => handle(e.target.files?.[0])}
        />
        <span className="inline-flex cursor-pointer rounded-xl border border-surface-sunken bg-surface-raised px-4 py-2.5 text-sm font-semibold text-ink shadow-sm hover:bg-surface">
          {loading ? "Processing…" : "Browse PDF"}
        </span>
      </label>
      <p className="mt-4 text-xs text-ink-faint">Best results with text-based PDFs · Max ~10 pages</p>
    </div>
  );
}
