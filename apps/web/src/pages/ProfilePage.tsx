import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Spinner } from "../components/ui/Spinner";
import { apiClient } from "../lib/api";

export function ProfilePage() {
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .getProfile()
      .then((res) => {
        if (res.profile?.data) {
          setJsonText(JSON.stringify(res.profile.data, null, 2));
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const parsed = JSON.parse(jsonText);
      await apiClient.saveProfile(parsed);
      setMessage("Master profile saved.");
    } catch (err) {
      setMessage("");
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading profile…" />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Master data"
        title="Your profile"
        description="Everything here is the source of truth. AI can only reorder and rephrase these facts."
        action={
          <Link to="/onboarding">
            <Button variant="secondary">Re-import CV</Button>
          </Link>
        }
      />

      {error && <Alert tone="error">{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}

      <Alert tone="info" title="Advanced editing">
        JSON view for power users. Invalid JSON will block save. Most users never need
        to edit this manually.
      </Alert>

      <Card padding="none">
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={22}
          spellCheck={false}
          className="w-full rounded-2xl border-0 bg-ink/95 p-5 font-mono text-xs leading-relaxed text-emerald-100/90 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" loading={saving} onClick={save}>
          Save changes
        </Button>
        <Link to="/generate">
          <Button variant="secondary" size="lg">
            Tailor for a job →
          </Button>
        </Link>
      </div>
    </div>
  );
}
