import { GoogleGenerativeAI } from "@google/generative-ai";

/** Current stable flash model (see https://ai.google.dev/gemini-api/docs/models) */
const DEFAULT_MODEL = "gemini-2.5-flash";

const DEPRECATED_ALIASES: Record<string, string> = {
  "gemini-1.5-pro": DEFAULT_MODEL,
  "gemini-1.5-flash": DEFAULT_MODEL,
  "gemini-1.5-flash-8b": DEFAULT_MODEL,
  "gemini-pro": DEFAULT_MODEL,
  "gemini-2.0-flash": DEFAULT_MODEL,
  "gemini-2.0-flash-lite": DEFAULT_MODEL,
};

export function resolveGeminiModel(): string {
  const configured = (process.env.GEMINI_MODEL ?? DEFAULT_MODEL).trim();
  return DEPRECATED_ALIASES[configured] ?? configured;
}

export async function geminiJson<T>(
  apiKey: string,
  systemInstruction: string,
  userPrompt: string,
): Promise<T> {
  const modelName = resolveGeminiModel();
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return JSON.parse(text) as T;
}
