import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../lib/api";

export function ProfilePage() {
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiClient
      .getProfile()
      .then((res) => {
        if (res.profile?.data) {
          setJsonText(JSON.stringify(res.profile.data, null, 2));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setMessage("");
    setSaving(true);
    try {
      const parsed = JSON.parse(jsonText);
      await apiClient.saveProfile(parsed);
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading profile…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Master profile</h1>
        <Link to="/onboarding" className="text-sm text-brand-600 hover:underline">
          Re-import CV
        </Link>
      </div>
      <p className="text-sm text-slate-600">
        Source of truth for AI. Only facts here can appear in tailored CVs.
      </p>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        rows={24}
        className="w-full rounded-xl border border-slate-300 p-3 font-mono text-xs"
        spellCheck={false}
      />
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
