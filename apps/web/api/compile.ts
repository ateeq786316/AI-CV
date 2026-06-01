import type { VercelRequest, VercelResponse } from "@vercel/node";
import { renderResumeTex } from "@ai-cv/latex-engine";
import { OptimizedResumeSchema } from "@ai-cv/shared";
import { requireUser, json } from "./_lib/auth.js";
import { handleError, methodNotAllowed } from "./_lib/handler.js";
import { compilePdfFromTex } from "./_lib/latex-compile.js";
import { checkRateLimit, logUsage } from "./_lib/rate-limit.js";
import { resolveGeminiKey } from "./_lib/keys.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const { user, supabase } = await requireUser(req);
    const { generationId, includeInvisibleAtsBlock } = req.body as {
      generationId?: string;
      includeInvisibleAtsBlock?: boolean;
    };

    if (!generationId) {
      return json(res, 400, { error: "generationId is required" });
    }

    const { isUserKey } = await resolveGeminiKey(supabase, user.id);
    await checkRateLimit(supabase, user.id, "compile", isUserKey);

    const { data: gen, error } = await supabase
      .from("generations")
      .select("id, optimized_data, user_id")
      .eq("id", generationId)
      .eq("user_id", user.id)
      .single();

    if (error || !gen) {
      return json(res, 404, { error: "Generation not found" });
    }

    const optimized = OptimizedResumeSchema.parse(gen.optimized_data);
    const tex = renderResumeTex(optimized, {
      includeInvisibleAtsBlock: includeInvisibleAtsBlock ?? false,
    });

    let pdfBase64: string | null = null;
    let pdfError: string | null = null;

    try {
      const pdfBuffer = await compilePdfFromTex(tex);
      pdfBase64 = pdfBuffer.toString("base64");

      const path = `${user.id}/${generationId}.pdf`;
      await supabase.storage.from("generated-pdfs").upload(path, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

      await supabase
        .from("generations")
        .update({
          status: "compiled",
          pdf_storage_path: path,
          updated_at: new Date().toISOString(),
        })
        .eq("id", generationId);
    } catch (compileErr) {
      pdfError =
        compileErr instanceof Error ? compileErr.message : "PDF compile failed";
      await supabase
        .from("generations")
        .update({ status: "preview", updated_at: new Date().toISOString() })
        .eq("id", generationId);
    }

    await logUsage(supabase, user.id, "compile", !isUserKey, generationId);

    return json(res, 200, {
      tex,
      pdfBase64,
      pdfError,
    });
  } catch (err) {
    return handleError(res, err);
  }
}
