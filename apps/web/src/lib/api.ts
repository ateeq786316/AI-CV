import { supabase } from "./supabase";

async function getToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not signed in");
  return token;
}

async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export const apiClient = {
  extract: (text: string, source: "paste" | "pdf") =>
    api<{ profileId: string; master: unknown }>("/api/extract", {
      method: "POST",
      body: JSON.stringify({ text, source }),
    }),

  getProfile: () =>
    api<{ profile: { id: string; data: unknown } | null }>("/api/profile"),

  saveProfile: (master: unknown) =>
    api<{ profile: unknown }>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(master),
    }),

  optimize: (payload: {
    jobDescription: string;
    jobTitle?: string;
    mode?: string;
    fallbackProfile?: string;
  }) =>
    api<{
      generationId: string;
      status: string;
      optimized: unknown;
      coverLetter: string;
      validationErrors?: unknown[];
      changesSummary?: string;
    }>("/api/optimize", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  compile: (generationId: string) =>
    api<{ tex: string; pdfBase64: string | null; pdfError: string | null }>(
      "/api/compile",
      {
        method: "POST",
        body: JSON.stringify({ generationId }),
      },
    ),

  listGenerations: () =>
    api<{ generations: GenerationRow[] }>("/api/generations"),

  getGeneration: (id: string) =>
    api<{ generation: GenerationRow }>(`/api/generations?id=${id}`),

  getApiKeyStatus: () =>
    api<{ configured: boolean; hint: string | null }>("/api/api-key"),

  saveApiKey: (apiKey: string) =>
    api<{ ok: boolean }>("/api/api-key", {
      method: "POST",
      body: JSON.stringify({ apiKey }),
    }),

  deleteApiKey: () =>
    api<{ ok: boolean }>("/api/api-key", { method: "DELETE" }),
};

export interface GenerationRow {
  id: string;
  job_title: string | null;
  job_description: string;
  status: string;
  optimization_mode: string;
  created_at: string;
  optimized_data?: unknown;
  cover_letter?: string;
}
