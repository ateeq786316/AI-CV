import { decrypt, encrypt } from "./crypto.js";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function resolveGeminiKey(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ key: string; isUserKey: boolean }> {
  const { data } = await supabase
    .from("user_api_keys")
    .select("encrypted_key")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.encrypted_key) {
    return { key: decrypt(data.encrypted_key), isUserKey: true };
  }

  const platform = process.env.GEMINI_API_KEY;
  if (!platform) {
    throw new KeyError(
      "No API key configured. Add your Gemini key in Settings or contact admin.",
      402,
    );
  }
  return { key: platform, isUserKey: false };
}

export async function saveUserGeminiKey(
  supabase: SupabaseClient,
  userId: string,
  apiKey: string,
) {
  const encrypted_key = encrypt(apiKey);
  const key_hint = apiKey.slice(-4);
  const { error } = await supabase.from("user_api_keys").upsert({
    user_id: userId,
    provider: "gemini",
    encrypted_key,
    key_hint,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export class KeyError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "KeyError";
  }
}
