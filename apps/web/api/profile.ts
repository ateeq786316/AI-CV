import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MasterResumeSchema } from "@ai-cv/shared";
import { requireUser, json } from "./_lib/auth.js";
import { handleError, methodNotAllowed } from "./_lib/handler.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { user, supabase } = await requireUser(req);

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("master_profiles")
        .select("id, data, extraction_source, updated_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return json(res, 200, { profile: data ?? null });
    }

    if (req.method === "PUT") {
      const master = MasterResumeSchema.parse(req.body);
      const { data, error } = await supabase
        .from("master_profiles")
        .upsert(
          {
            user_id: user.id,
            schema_version: 1,
            data: master,
            extraction_source: master._meta?.source ?? "manual",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )
        .select("id, data, updated_at")
        .single();

      if (error) throw error;
      return json(res, 200, { profile: data });
    }

    return methodNotAllowed(res, ["GET", "PUT"]);
  } catch (err) {
    return handleError(res, err);
  }
}
