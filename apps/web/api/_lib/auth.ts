import type { VercelRequest } from "@vercel/node";
import { getServiceClient } from "./supabase.js";

export async function requireUser(req: VercelRequest) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    throw new AuthError("Missing authorization token", 401);
  }
  const token = auth.slice(7);
  const supabase = getServiceClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    throw new AuthError("Invalid or expired session", 401);
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
