import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-2.0-flash";

export async function geminiJson<T>(
  apiKey: string,
  systemInstruction: string,
  userPrompt: string,
): Promise<T> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
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
