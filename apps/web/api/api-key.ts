import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireUser, json } from "./_lib/auth.js";
import { handleError, methodNotAllowed } from "./_lib/handler.js";
import { saveUserGeminiKey } from "./_lib/keys.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { user, supabase } = await requireUser(req);

    if (req.method === "GET") {
      const { data } = await supabase
        .from("user_api_keys")
        .select("key_hint, updated_at")
        .eq("user_id", user.id)
        .maybeSingle();
      return json(res, 200, { configured: Boolean(data), hint: data?.key_hint ?? null });
    }

    if (req.method === "POST") {
      const { apiKey } = req.body as { apiKey?: string };
      if (!apiKey || apiKey.length < 20) {
        return json(res, 400, { error: "Invalid API key" });
      }
      await saveUserGeminiKey(supabase, user.id, apiKey!);
      return json(res, 200, { ok: true, hint: apiKey!.slice(-4) });
    }

    if (req.method === "DELETE") {
      await supabase.from("user_api_keys").delete().eq("user_id", user.id);
      return json(res, 200, { ok: true });
    }

    return methodNotAllowed(res, ["GET", "POST", "DELETE"]);
  } catch (err) {
    return handleError(res, err);
  }
}
