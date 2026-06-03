export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    env.supabaseUrl?.startsWith("https://") &&
      env.supabaseAnonKey?.startsWith("eyJ"),
  );
}
