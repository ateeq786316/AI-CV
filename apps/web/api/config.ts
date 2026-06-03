import type { VercelRequest, VercelResponse } from "@vercel/node";
import { json } from "./_lib/auth.js";

function pickEnv(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

function normalizeUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("https://")) return url.replace(/\/$/, "");
  // Common mistake: only project ref, e.g. ogxuuoxicvszwpatxoap
  if (/^[a-z0-9]+$/.test(url)) {
    return `https://${url}.supabase.co`;
  }
  return url;
}

/** Public Supabase config for the browser (anon key only — safe with RLS). */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const supabaseUrl = normalizeUrl(
    pickEnv("SUPABASE_URL", "VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"),
  );
  const supabaseAnonKey = pickEnv(
    "SUPABASE_ANON_KEY",
    "VITE_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );

  const missing: string[] = [];
  if (!supabaseUrl) missing.push("SUPABASE_URL");
  if (!supabaseAnonKey) missing.push("SUPABASE_ANON_KEY");

  if (missing.length > 0) {
    return json(res, 500, {
      error: `Missing ${missing.join(" and ")} on Vercel. Use your Supabase anon public key for SUPABASE_ANON_KEY.`,
      missing,
    });
  }

  if (!supabaseAnonKey.startsWith("eyJ")) {
    return json(res, 500, {
      error:
        "SUPABASE_ANON_KEY looks wrong. Use the anon public JWT from Supabase → Settings → API (starts with eyJ…), not the service_role key.",
    });
  }

  return json(res, 200, { supabaseUrl, supabaseAnonKey });
}
