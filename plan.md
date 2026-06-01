# AI CV Enhancer — Implementation Plan

## Status legend

- [x] Done
- [ ] Not started / in progress

---

## Phase 0 — Foundation (DONE)

- [x] LaTeX template + `reference.tex` + preamble
- [x] `MasterResume` / `OptimizedResume` Zod schemas
- [x] `latex-engine` JSON → `.tex`
- [x] `truth-lock` validation
- [x] Seed JSON from your CV
- [x] Supabase migration SQL

---

## Phase 1 — Monorepo + AI package (THIS SPRINT)

- [x] `packages/ai` — Gemini client, extract & optimize prompts
- [x] Root workspaces include `apps/web`
- [x] `.env.example` with all required vars

---

## Phase 2 — Frontend (`apps/web`)

- [x] Vite + React + TypeScript + Tailwind
- [x] Supabase Auth (email/password)
- [x] Routes: login, dashboard, onboarding, master edit, generate, preview, settings
- [x] Paste CV / PDF text extract (client `pdfjs-dist`)
- [x] Master profile CRUD (Supabase)
- [x] Job description form + optimization mode
- [x] Preview: optimized JSON + cover letter + approve flow
- [x] Generation history list

---

## Phase 3 — API (Vercel serverless in `apps/web/api`)

- [x] `POST /api/extract` — text → MasterResume (Gemini)
- [x] `POST /api/optimize` — master + JD → OptimizedResume + truth-lock
- [x] `POST /api/compile` — generation → `.tex` + PDF (external LaTeX API)
- [x] `GET/POST /api/profile` — master profile
- [x] `POST/DELETE /api/api-key` — BYOK encrypt/store
- [x] JWT auth via Supabase on all protected routes
- [x] Rate limit via `usage_events`

---

## Phase 4 — Deploy

- [x] `apps/web/vercel.json` SPA rewrites + API
- [x] README deploy steps (Supabase + Vercel + Gemini)
- [ ] User runs: create Supabase project, apply migration, set env, deploy

---

## Phase 5 — Later (post-MVP)

- [ ] Docker `texlive` compile service (replace external API)
- [ ] PDF upload extraction quality
- [ ] LinkedIn / missing-skills report
- [ ] Multi-template support
- [ ] Public share links

---

## Deploy checklist (you)

1. Create [Supabase](https://supabase.com) project → run `supabase/migrations/001_initial.sql`
2. Enable Email auth in Supabase dashboard
3. Create [Google AI](https://aistudio.google.com/apikey) Gemini API key
4. Copy `.env.example` → `apps/web/.env.local` and fill values
5. `npm install` from repo root → `npm run build`
6. Deploy `apps/web` to Vercel (root directory: `apps/web`)
7. Add same env vars in Vercel project settings

---

## Architecture (deployed)

```
Browser (React)
    → Supabase Auth
    → Vercel /api/* (Gemini, truth-lock, latex-engine)
    → Supabase Postgres (profiles, master_profiles, generations)
    → LaTeX.Online-style API (PDF compile, optional)
```
