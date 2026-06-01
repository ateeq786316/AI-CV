import type { SupabaseClient } from "@supabase/supabase-js";

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  eventType: string,
  isUserKey: boolean,
): Promise<void> {
  const limit = isUserKey
    ? Number(process.env.DAILY_LIMIT_BYOK ?? 100)
    : Number(process.env.DAILY_LIMIT_PLATFORM ?? 20);

  const since = new Date();
  since.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("usage_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", eventType)
    .gte("created_at", since.toISOString());

  if (error) throw error;
  if ((count ?? 0) >= limit) {
    throw new RateLimitError(
      `Daily limit reached (${limit} ${eventType} requests). Try again tomorrow or add your own Gemini API key.`,
    );
  }
}

export async function logUsage(
  supabase: SupabaseClient,
  userId: string,
  eventType: string,
  usedPlatformKey: boolean,
  generationId?: string,
) {
  await supabase.from("usage_events").insert({
    user_id: userId,
    event_type: eventType,
    used_platform_key: usedPlatformKey,
    generation_id: generationId ?? null,
  });
}

export class RateLimitError extends Error {
  status = 429;
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}
