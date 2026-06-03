import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../routes";
import { Button } from "../ui/Button";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-surface-sunken/60 bg-surface-raised/85 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to={ROUTES.home} className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-sm font-bold text-white shadow-sm">
              CV
            </span>
            <span className="font-display text-lg font-semibold text-ink group-hover:text-accent">
              CV Tailor
            </span>
          </Link>

          {onLanding && (
            <nav className="hidden items-center gap-8 md:flex">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link to={ROUTES.dashboard}>
                <Button size="md">Open dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.login} className="hidden sm:block">
                  <Button variant="ghost" size="md">
                    Sign in
                  </Button>
                </Link>
                <Link to={ROUTES.signup}>
                  <Button size="md">Get started free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-surface-sunken bg-sidebar text-sidebar-text">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-xl font-semibold text-white">CV Tailor</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              Tailor your CV to every job description while keeping one professional
              LaTeX layout — and never inventing experience you do not have.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">
              Product
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {onLanding &&
                links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              <li>
                <Link to={ROUTES.signup} className="hover:text-white">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">
              Account
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to={ROUTES.login} className="hover:text-white">
                  Sign in
                </Link>
              </li>
              {user && (
                <li>
                  <Link to={ROUTES.dashboard} className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-sidebar-border py-6 text-center text-xs">
          © {new Date().getFullYear()} CV Tailor. Built for serious job applications.
        </div>
      </footer>
    </div>
  );
}
