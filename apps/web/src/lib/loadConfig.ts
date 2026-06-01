import type { PublicSupabaseConfig } from "./supabase";
import { env, isSupabaseConfigured } from "./env";

export async function loadPublicConfig(): Promise<PublicSupabaseConfig> {
  if (isSupabaseConfigured()) {
    return {
      supabaseUrl: env.supabaseUrl!,
      supabaseAnonKey: env.supabaseAnonKey!,
    };
  }

  const res = await fetch("/api/config");
  const body = await res.json();

  if (!res.ok) {
    throw new Error(
      body.error ??
        "Could not load Supabase config. Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel.",
    );
  }

  if (!body.supabaseUrl || !body.supabaseAnonKey) {
    throw new Error("Invalid config from server");
  }

  return {
    supabaseUrl: body.supabaseUrl,
    supabaseAnonKey: body.supabaseAnonKey,
  };
}
