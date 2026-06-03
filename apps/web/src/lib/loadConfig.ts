import type { PublicSupabaseConfig } from "./supabase";
import { env, isSupabaseConfigured } from "./env";

function isValidAnonKey(key: string | undefined): key is string {
  return Boolean(key && key.length > 20 && key.startsWith("eyJ"));
}

function isValidSupabaseUrl(url: string | undefined): url is string {
  return Boolean(url && url.startsWith("https://") && url.includes(".supabase.co"));
}

async function fetchRuntimeConfig(): Promise<PublicSupabaseConfig> {
  const res = await fetch("/api/config", { cache: "no-store" });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(
      body.error ??
        "Could not load Supabase config. Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel, then redeploy.",
    );
  }

  if (!isValidSupabaseUrl(body.supabaseUrl) || !isValidAnonKey(body.supabaseAnonKey)) {
    throw new Error(
      "Invalid Supabase config from server. Set SUPABASE_ANON_KEY to your anon public key (starts with eyJ…).",
    );
  }

  return {
    supabaseUrl: body.supabaseUrl,
    supabaseAnonKey: body.supabaseAnonKey,
  };
}

export async function loadPublicConfig(): Promise<PublicSupabaseConfig> {
  // Production: always use runtime config so Vercel env vars work without VITE_ rebuild
  if (import.meta.env.PROD) {
    return fetchRuntimeConfig();
  }

  if (isSupabaseConfigured() && isValidAnonKey(env.supabaseAnonKey)) {
    return {
      supabaseUrl: env.supabaseUrl!,
      supabaseAnonKey: env.supabaseAnonKey!,
    };
  }

  return fetchRuntimeConfig();
}
