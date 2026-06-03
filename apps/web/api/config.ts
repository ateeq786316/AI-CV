import type { VercelRequest, VercelResponse } from "@vercel/node";
import { json } from "./_lib/auth.js";

import { getAnonKey, getSupabaseUrl } from "./_lib/supabase.js";

/** Public Supabase config for the browser (anon key only — safe with RLS). */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  let supabaseUrl = "";
  let supabaseAnonKey = "";
  try {
    supabaseUrl = getSupabaseUrl();
    supabaseAnonKey = getAnonKey();
  } catch {
    /* fall through to missing check */
  }

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
