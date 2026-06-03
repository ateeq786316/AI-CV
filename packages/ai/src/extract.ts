import {
  MasterResumeSchema,
  normalizeMasterResumeRaw,
  type MasterResume,
} from "@ai-cv/shared";
import { ZodError } from "zod";
import { geminiJson } from "./gemini.js";
import { EXTRACT_SYSTEM, extractUserPrompt } from "./prompts.js";

function parseMaster(raw: unknown): MasterResume {
  const normalized = normalizeMasterResumeRaw(raw);
  return MasterResumeSchema.parse(normalized);
}

export async function extractMasterResume(
  apiKey: string,
  rawText: string,
): Promise<MasterResume> {
  let raw = await geminiJson<unknown>(
    apiKey,
    EXTRACT_SYSTEM,
    extractUserPrompt(rawText),
  );

  try {
    return parseMaster(raw);
  } catch (err) {
    if (!(err instanceof ZodError)) throw err;

    raw = await geminiJson<unknown>(
      apiKey,
      EXTRACT_SYSTEM,
      `${extractUserPrompt(rawText)}\n\nFIX JSON to match schema. Previous errors:\n${JSON.stringify(err.flatten().fieldErrors)}`,
    );

    try {
      return parseMaster(raw);
    } catch (retryErr) {
      if (retryErr instanceof ZodError) {
        throw new Error(
          `CV extraction validation failed: ${JSON.stringify(retryErr.flatten().fieldErrors)}`,
        );
      }
      throw retryErr;
    }
  }
}
