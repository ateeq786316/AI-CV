import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface PublicSupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

let client: SupabaseClient | null = null;

export function initSupabase(config: PublicSupabaseConfig): SupabaseClient {
  client = createClient(config.supabaseUrl, config.supabaseAnonKey);
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
