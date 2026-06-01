import {
  MasterResumeSchema,
  OptimizedResumeSchema,
  type MasterResume,
  type OptimizedResume,
} from "@ai-cv/shared";
import { geminiJson } from "./gemini.js";
import { OPTIMIZE_SYSTEM, optimizeUserPrompt } from "./prompts.js";

export type OptimizationMode = "safe" | "balanced" | "ats_assist";

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
  const parsed = OptimizedResumeSchema.parse(raw);
  parsed.personal.fullName = master.personal.fullName;
  return parsed;
}

export function parseMaster(data: unknown): MasterResume {
  return MasterResumeSchema.parse(data);
}
