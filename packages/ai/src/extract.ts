import { MasterResumeSchema, type MasterResume } from "@ai-cv/shared";
import { geminiJson } from "./gemini.js";
import { EXTRACT_SYSTEM, extractUserPrompt } from "./prompts.js";

export async function extractMasterResume(
  apiKey: string,
  rawText: string,
): Promise<MasterResume> {
  const raw = await geminiJson<unknown>(
    apiKey,
    EXTRACT_SYSTEM,
    extractUserPrompt(rawText),
  );
  return MasterResumeSchema.parse(raw);
}
