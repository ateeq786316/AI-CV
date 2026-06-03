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
      error: "Server configuration incomplete.",
      ...(process.env.NODE_ENV !== "production" && { missing }),
    });
  }

  if (!supabaseAnonKey.startsWith("eyJ")) {
    return json(res, 500, {
      error: "Server misconfiguration. Contact the site administrator.",
    });
  }

  // Reject service_role JWT (role claim must be anon, not service_role)
  try {
    const payload = JSON.parse(
      Buffer.from(supabaseAnonKey.split(".")[1]!, "base64url").toString("utf8"),
    ) as { role?: string };
    if (payload.role === "service_role") {
      return json(res, 500, {
        error: "Server misconfiguration. Contact the site administrator.",
      });
    }
  } catch {
    return json(res, 500, { error: "Server misconfiguration." });
  }

  return json(res, 200, { supabaseUrl, supabaseAnonKey });
}
