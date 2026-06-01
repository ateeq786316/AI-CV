import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireUser, json } from "./_lib/auth.js";
import { handleError, methodNotAllowed } from "./_lib/handler.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { user, supabase } = await requireUser(req);

    if (req.method === "GET") {
      const id = req.query.id as string | undefined;

      if (id) {
        const { data, error } = await supabase
          .from("generations")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();
        if (error) return json(res, 404, { error: "Not found" });
        return json(res, 200, { generation: data });
      }

      const { data, error } = await supabase
        .from("generations")
        .select("id, job_title, job_description, status, optimization_mode, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return json(res, 200, { generations: data });
    }

    return methodNotAllowed(res, ["GET"]);
  } catch (err) {
    return handleError(res, err);
  }
}
