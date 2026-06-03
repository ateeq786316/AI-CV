import { FormEvent, useEffect, useState } from "react";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
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
      setMessage("API key saved securely.");
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    await apiClient.deleteApiKey();
    setMessage("Removed. Platform key will be used when available.");
    refresh();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Optional: bring your own Gemini API key if shared quota runs out."
      />

      <Card>
        <h2 className="font-display text-lg font-semibold text-ink">Gemini API key</h2>
        <p className="prose-muted mt-2">
          Get a free key from{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            Google AI Studio
          </a>
          . Encrypted at rest in your account.
        </p>
        {configured && (
          <p className="mt-3 text-sm font-medium text-emerald-700">
            Active key ending in …{hint}
          </p>
        )}
        <form onSubmit={save} className="mt-6 space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste API key"
            className="input-field"
            autoComplete="off"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={loading} disabled={!apiKey}>
              Save key
            </Button>
            {configured && (
              <Button type="button" variant="secondary" onClick={remove}>
                Remove
              </Button>
            )}
          </div>
        </form>
        {message && (
          <p className="mt-4 text-sm text-ink-muted">{message}</p>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold text-ink">Checklist</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink-muted">
          <li>✓ GEMINI_MODEL = gemini-2.5-flash</li>
          <li>✓ PDF fails? Download .tex → Overleaf</li>
        </ul>
      </Card>
    </div>
  );
}
