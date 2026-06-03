import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-sidebar p-12 text-white lg:flex">
        <div>
          <Link to="/" className="font-display text-2xl font-semibold">
            CV Tailor
          </Link>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            One CV. Every job. Zero layout surprises.
          </h2>
          <p className="mt-4 text-lg text-sidebar-text">
            Upload your master profile once. Paste a job description. Download a
            tailored PDF that keeps your professional LaTeX design.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-sidebar-text">
            <li className="flex gap-2">
              <span className="text-accent-ring">✓</span> Truth-locked AI — no fake skills
            </li>
            <li className="flex gap-2">
              <span className="text-accent-ring">✓</span> Your Overleaf template, every time
            </li>
            <li className="flex gap-2">
              <span className="text-accent-ring">✓</span> Cover letter paragraph included
            </li>
          </ul>
        </div>
        <p className="text-xs text-sidebar-text">Built for serious job applications</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md animate-slide-up">
          <p className="text-xs font-bold uppercase tracking-widest text-accent lg:hidden">
            CV Tailor
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{title}</h1>
          <p className="prose-muted mt-2">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>
        </div>
      </div>
    </div>
  );
}
