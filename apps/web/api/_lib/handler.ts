import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AuthError, json } from "./auth.js";
import { KeyError } from "./keys.js";
import { RateLimitError } from "./rate-limit.js";
import { CompileError } from "./latex-compile.js";

export function handleError(res: VercelResponse, err: unknown) {
  if (err instanceof AuthError) return json(res, err.status, { error: err.message });
  if (err instanceof KeyError) return json(res, err.status, { error: err.message });
  if (err instanceof RateLimitError) return json(res, 429, { error: err.message });
  if (err instanceof CompileError) return json(res, err.status, { error: err.message });
  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  const status = message.includes("validation failed") ? 400 : 500;
  const safeMessage =
    status === 400
      ? message
      : process.env.NODE_ENV === "production"
        ? "Something went wrong. Try again or contact support."
        : message;
  return json(res, status, { error: safeMessage });
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]) {
  return json(res, 405, { error: `Method not allowed. Use ${allowed.join(", ")}.` });
}

export type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<void>;
