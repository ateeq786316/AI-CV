/**
 * Single source of truth for app URLs.
 *
 * Public entry (website start):  ROUTES.home  →  "/"
 * App home (after sign-in):    ROUTES.dashboard  →  "/dashboard"
 */
export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  onboarding: "/onboarding",
  profile: "/profile",
  generate: "/generate",
  settings: "/settings",
  preview: (id: string) => `/preview/${id}` as const,
} as const;

/** Legacy / typo paths → canonical routes */
export const ROUTE_REDIRECTS: Record<string, string> = {
  "/home": ROUTES.dashboard,
  "/app": ROUTES.dashboard,
};

/** Child path under the protected layout (no leading slash) */
export function routeSegment(path: string): string {
  return path.replace(/^\//, "");
}
