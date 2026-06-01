import type { VercelRequest, VercelResponse } from "@vercel/node";
import { optimizeResume, type OptimizationMode } from "@ai-cv/ai";
import { MasterResumeSchema } from "@ai-cv/shared";
import { validateTruthLock } from "@ai-cv/truth-lock";
import { requireUser, json } from "./_lib/auth.js";
import { handleError, methodNotAllowed } from "./_lib/handler.js";
import { resolveGeminiKey } from "./_lib/keys.js";
import { checkRateLimit, logUsage } from "./_lib/rate-limit.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const { user, supabase } = await requireUser(req);
    const body = req.body as {
      jobDescription?: string;
      jobTitle?: string;
      mode?: OptimizationMode;
      fallbackProfile?: string;
      master?: unknown;
    };

    if (!body.jobDescription?.trim()) {
      return json(res, 400, { error: "jobDescription is required" });
    }

    let master = body.master
      ? MasterResumeSchema.parse(body.master)
      : null;

    if (!master) {
      const { data: row, error } = await supabase
        .from("master_profiles")
        .select("id, data")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!row) {
        return json(res, 400, { error: "No master profile. Upload or paste your CV first." });
      }
      master = MasterResumeSchema.parse(row.data);
    }

    const { key, isUserKey } = await resolveGeminiKey(supabase, user.id);
    await checkRateLimit(supabase, user.id, "optimize", isUserKey);

    const mode = body.mode ?? "balanced";
    let optimized = await optimizeResume(
      key,
      master,
      body.jobDescription,
      mode,
      body.fallbackProfile,
    );

    let validation = validateTruthLock(master, optimized);
    if (!validation.valid) {
      optimized = await optimizeResume(
        key,
        master,
        `${body.jobDescription}\n\nFIX: Do not add skills or companies not in master. Errors: ${JSON.stringify(validation.errors)}`,
        "safe",
        body.fallbackProfile,
      );
      validation = validateTruthLock(master, optimized);
    }

    const { data: profile, error: profileErr } = await supabase
      .from("master_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileErr) throw profileErr;
    if (!profile) {
      return json(res, 400, { error: "Save a master profile before generating." });
    }

    const { data: generation, error: genError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        master_profile_id: profile.id,
        job_title: body.jobTitle ?? null,
        job_description: body.jobDescription,
        optimization_mode: mode,
        fallback_profile: body.fallbackProfile ?? null,
        status: validation.valid ? "preview" : "failed",
        optimized_data: optimized,
        cover_letter: optimized.coverLetterParagraph,
        validation_errors: validation.valid ? null : validation.errors,
      })
      .select("id, status, optimized_data, cover_letter, validation_errors")
      .single();

    if (genError) throw genError;

    await logUsage(supabase, user.id, "optimize", !isUserKey, generation.id);

    return json(res, 200, {
      generationId: generation.id,
      status: generation.status,
      optimized: generation.optimized_data,
      coverLetter: generation.cover_letter,
      validationErrors: generation.validation_errors,
      changesSummary: optimized.changesSummary,
    });
  } catch (err) {
    return handleError(res, err);
  }
}
