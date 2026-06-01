import { FormEvent, useEffect, useState } from "react";
import { apiClient } from "../lib/api";

export function SettingsPage() {
  const [configured, setConfigured] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    apiClient.getApiKeyStatus().then((r) => {
      setConfigured(r.configured);
      setHint(r.hint);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await apiClient.saveApiKey(apiKey);
      setApiKey("");
      setMessage("Gemini API key saved (encrypted).");
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    await apiClient.deleteApiKey();
    setMessage("Removed your API key. Platform key will be used if configured.");
    refresh();
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="rounded-xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="font-semibold">Your Gemini API key (BYOK)</h2>
        <p className="mt-2 text-sm text-slate-600">
          If platform quota runs out, add your own free Gemini key from{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 underline"
          >
            Google AI Studio
          </a>
          . Stored encrypted in Supabase.
        </p>
        {configured && (
          <p className="mt-2 text-sm text-green-700">
            Key configured (ends with …{hint})
          </p>
        )}
        <form onSubmit={save} className="mt-4 space-y-3">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !apiKey}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              Save key
            </button>
            {configured && (
              <button
                type="button"
                onClick={remove}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Remove
              </button>
            )}
          </div>
        </form>
        {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
      </section>
    </div>
  );
}
