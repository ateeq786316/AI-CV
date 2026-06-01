import type { VercelRequest, VercelResponse } from "@vercel/node";
import { json } from "./_lib/auth.js";

/** Public Supabase config for the browser (anon key only — safe with RLS). */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return json(res, 500, {
      error:
        "Missing SUPABASE_URL or SUPABASE_ANON_KEY on server. Add them in Vercel Environment Variables and redeploy.",
    });
  }

  return json(res, 200, { supabaseUrl, supabaseAnonKey });
}
