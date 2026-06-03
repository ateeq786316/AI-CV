import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface PublicSupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

let client: SupabaseClient | null = null;

export function initSupabase(config: PublicSupabaseConfig): SupabaseClient {
  const url = config.supabaseUrl?.trim();
  const key = config.supabaseAnonKey?.trim();

  if (!url || !key || !key.startsWith("eyJ")) {
    throw new Error(
      "Supabase anon key missing or invalid. Set SUPABASE_ANON_KEY on Vercel.",
    );
  }

  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return client;
}

export function getSupabase(): SupabaseClient {
  if (!client) {
    throw new Error("Supabase not initialized yet");
  }
  return client;
}

export function isSupabaseReady(): boolean {
  return client !== null;
}
