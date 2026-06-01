import type { VercelRequest, VercelResponse } from "@vercel/node";
import { extractMasterResume } from "@ai-cv/ai";
import { requireUser, json } from "./_lib/auth.js";
import { handleError, methodNotAllowed } from "./_lib/handler.js";
import { resolveGeminiKey } from "./_lib/keys.js";
import { checkRateLimit, logUsage } from "./_lib/rate-limit.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const { user, supabase } = await requireUser(req);
    const { text, source } = req.body as { text?: string; source?: string };

    if (!text?.trim()) {
      return json(res, 400, { error: "text is required" });
    }

    const { key, isUserKey } = await resolveGeminiKey(supabase, user.id);
    await checkRateLimit(supabase, user.id, "extract", isUserKey);

    const master = await extractMasterResume(key, text.trim());
    master._meta = {
      source: (source as "paste" | "pdf") ?? "paste",
      extractedAt: new Date().toISOString(),
    };

    const { data: profile, error } = await supabase
      .from("master_profiles")
      .upsert(
        {
          user_id: user.id,
          schema_version: 1,
          data: master,
          extraction_source: master._meta.source,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select("id, data")
      .single();

    if (error) throw error;

    await logUsage(supabase, user.id, "extract", !isUserKey);

    return json(res, 200, { profileId: profile.id, master });
  } catch (err) {
    return handleError(res, err);
  }
}
