import type { VercelRequest } from "@vercel/node";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createUserClient } from "./supabase.js";

export async function requireUser(req: VercelRequest): Promise<{
  user: User;
  token: string;
  supabase: SupabaseClient;
}> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    throw new AuthError("Missing authorization token. Sign in again.", 401);
  }
  const token = auth.slice(7).trim();
  if (!token) {
    throw new AuthError("Missing authorization token. Sign in again.", 401);
  }

  const supabase = createUserClient(token);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new AuthError(
      `Invalid or expired session. Sign out, sign in again, and retry. (${error?.message ?? "no user"})`,
      401,
    );
  }

  return { user: data.user, token, supabase };
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function json(res: import("@vercel/node").VercelResponse, status: number, body: unknown) {
  res.status(status).json(body);
}
