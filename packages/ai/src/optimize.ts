import {
  MasterResumeSchema,
  OptimizedResumeSchema,
  normalizeMasterResumeRaw,
  type MasterResume,
  type OptimizedResume,
} from "@ai-cv/shared";
import { ZodError } from "zod";
import { geminiJson } from "./gemini.js";
import { OPTIMIZE_SYSTEM, optimizeUserPrompt } from "./prompts.js";

export type OptimizationMode = "safe" | "balanced" | "ats_assist";

function parseOptimized(raw: unknown, master: MasterResume): OptimizedResume {
  const n = normalizeMasterResumeRaw(raw) as Record<string, unknown>;
  n.coverLetterParagraph =
    typeof n.coverLetterParagraph === "string"
      ? n.coverLetterParagraph
      : typeof n.coverLetter === "string"
        ? n.coverLetter
        : "";
  n.atsKeywords = Array.isArray(n.atsKeywords)
    ? n.atsKeywords.map(String)
    : [];

  const parsed = OptimizedResumeSchema.parse(n);
  parsed.personal.fullName = master.personal.fullName;
  return parsed;
}

export async function optimizeResume(
  apiKey: string,
  master: MasterResume,
  jobDescription: string,
  mode: OptimizationMode = "balanced",
  fallbackProfile?: string,
): Promise<OptimizedResume> {
  const masterJson = JSON.stringify(master);
  const raw = await geminiJson<unknown>(
    apiKey,
    OPTIMIZE_SYSTEM,
    optimizeUserPrompt(masterJson, jobDescription, mode, fallbackProfile),
  );

  try {
    return parseOptimized(raw, master);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error(
        `Optimization validation failed: ${JSON.stringify(err.flatten().fieldErrors)}`,
      );
    }
    throw err;
  }
}

export function parseMaster(data: unknown): MasterResume {
  return MasterResumeSchema.parse(normalizeMasterResumeRaw(data));
}
