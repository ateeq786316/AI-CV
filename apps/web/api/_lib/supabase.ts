import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function pickEnv(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

export function getSupabaseUrl(): string {
  const url = pickEnv("SUPABASE_URL", "VITE_SUPABASE_URL");
  if (!url) {
    throw new Error("Missing SUPABASE_URL on server");
  }
  if (!url.startsWith("https://") && /^[a-z0-9]+$/.test(url)) {
    return `https://${url}.supabase.co`;
  }
  return url.replace(/\/$/, "");
}

export function getAnonKey(): string {
  const key = pickEnv(
    "SUPABASE_ANON_KEY",
    "VITE_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
  if (!key) {
    throw new Error("Missing SUPABASE_ANON_KEY on server");
  }
  return key;
}

/** Validate JWT and run queries as the signed-in user (RLS). */
export function createUserClient(accessToken: string): SupabaseClient {
  const url = getSupabaseUrl();
  const anon = getAnonKey();
  return createClient(url, anon, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/** Admin client — optional; only needed if user-scoped client is insufficient. */
export function getServiceClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = pickEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
