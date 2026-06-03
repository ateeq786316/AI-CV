import { Link, Navigate } from "react-router-dom";
import { HeroPreview } from "../components/landing/HeroPreview";
import { MarketingLayout } from "../components/layout/MarketingLayout";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes";

const features = [
  {
    title: "Truth-locked AI",
    description:
      "Optimization only reorders and rephrases facts already on your master CV. No fake employers, dates, or skills.",
    icon: "🔒",
  },
  {
    title: "One LaTeX template",
    description:
      "Every export uses your professional Overleaf design. Layout stays identical — only content shifts for the role.",
    icon: "📄",
  },
  {
    title: "Three optimization modes",
    description:
      "Safe, Balanced, or ATS assist. Start with Balanced; dial up keyword alignment when you need it.",
    icon: "⚡",
  },
  {
    title: "Cover letter included",
    description:
      "A focused one-paragraph letter tailored to the job, generated alongside your CV.",
    icon: "✉️",
  },
  {
    title: "Preview before export",
    description:
      "Review the letter, structured CV data, and PDF in one place before you download.",
    icon: "👁️",
  },
  {
    title: "PDF or Overleaf",
    description:
      "Download a compiled PDF when the server allows, or grab `.tex` and compile in Overleaf — same result.",
    icon: "⬇️",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload your master CV",
    body: "Paste text or upload a PDF once. We extract roles, skills, and projects into a reusable profile.",
  },
  {
    step: "02",
    title: "Paste the job description",
    body: "Add the role title and JD. Pick how aggressive the rewrite should be — we never cross the truth line.",
  },
  {
    step: "03",
    title: "Review and download",
    body: "Check the cover letter and tailored bullets, then export PDF or LaTeX for your application.",
  },
];

const faqs = [
  {
    q: "Will the AI add skills I do not have?",
    a: "No. Truth-lock validation rejects output that introduces facts not present in your master profile. The goal is stronger presentation of what you already did.",
  },
  {
    q: "Do I need a new CV design for every job?",
    a: "No. You keep one fixed template. Each application gets content tuned to the JD while the visual structure stays the same.",
  },
  {
    q: "What if PDF compile fails?",
    a: "Download the `.tex` file and open it in Overleaf. You get the same template with full font support.",
  },
  {
    q: "Can I use my own Gemini API key?",
    a: "Yes. Add an encrypted BYOK key in Settings if shared platform quota runs out.",
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{children}</p>
  );
}

export function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner label="Loading…" />;
  if (user) return <Navigate to={ROUTES.dashboard} replace />;

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 20 25 / 0.06) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="animate-slide-up">
            <SectionLabel>AI resume tailoring</SectionLabel>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              One master CV.
              <span className="block text-accent">Perfect for every role.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
              Paste a job description. Get a tailored CV and cover letter in your professional
              LaTeX layout — without inventing experience or fighting Word formatting.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={ROUTES.signup}>
                <Button size="lg">Start free — upload your CV</Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg">
                  See how it works
                </Button>
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span> No credit card
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span> Master profile stored once
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✓</span> Export in minutes
              </li>
            </ul>
          </div>
          <div className="animate-fade-in lg:pl-4">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-surface-sunken bg-surface-raised/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          {[
            { value: "3 steps", label: "From upload to download" },
            { value: "1 template", label: "Consistent professional layout" },
            { value: "0 fiction", label: "Truth-lock on every generation" },
          ].map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="font-display text-2xl font-semibold text-ink">{s.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <SectionLabel>Why CV Tailor</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Built for people who apply seriously
            </h2>
            <p className="mt-4 text-lg text-ink-muted">
              Generic resume builders give you a new design every time. We give you the same
              trusted template with content that actually matches the posting.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.title}
                className="group rounded-2xl border border-surface-sunken/80 bg-surface-raised p-6 shadow-card transition-all hover:border-accent/20 hover:shadow-cardHover"
              >
                <span className="text-2xl" role="img" aria-hidden>
                  {f.icon}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink group-hover:text-accent">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-surface-sunken bg-ink py-20 text-white sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ring">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Three steps. No guesswork.
          </h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
                <span className="font-display text-4xl font-semibold text-accent-ring/40">
                  {s.step}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to={ROUTES.signup}>
              <Button
                size="lg"
                className="bg-white text-ink hover:bg-surface focus-visible:ring-white/40"
              >
                Create your account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-surface-sunken bg-surface-raised shadow-card">
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-surface-sunken p-8 lg:border-b-0 lg:border-r lg:p-12">
                <p className="text-sm font-semibold text-red-600/90">The old way</p>
                <ul className="mt-6 space-y-4 text-sm text-ink-muted">
                  <li>· Copy-paste CV into ChatGPT and hope formatting survives</li>
                  <li>· Manually rewrite bullets for every application</li>
                  <li>· Risk invented skills slipping through</li>
                  <li>· Rebuild layout in Word when nothing lines up</li>
                </ul>
              </div>
              <div className="bg-accent-light/40 p-8 lg:p-12">
                <p className="text-sm font-semibold text-accent">With CV Tailor</p>
                <ul className="mt-6 space-y-4 text-sm text-ink">
                  <li>· One master profile, unlimited tailored versions</li>
                  <li>· JD-aware bullets with explicit optimization modes</li>
                  <li>· Truth-lock rejects hallucinated facts</li>
                  <li>· Same LaTeX PDF every time — preview before send</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-t border-surface-sunken py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">
              Common questions
            </h2>
          </div>
          <dl className="mt-12 space-y-6">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-surface-sunken/80 bg-surface-raised px-6 py-5 shadow-card"
              >
                <dt className="font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-sidebar px-8 py-16 text-center sm:px-16">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent"
              aria-hidden
            />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                Ready for your next application?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-sidebar-text">
                Upload your CV once. Tailor it for every role you care about — in the time it
                takes to paste a job description.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to={ROUTES.signup}>
                  <Button size="lg">Get started free</Button>
                </Link>
                <Link to={ROUTES.login}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="border-sidebar-border bg-transparent text-white hover:bg-sidebar-hover"
                  >
                    I already have an account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
