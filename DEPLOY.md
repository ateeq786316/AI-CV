# Deploy AI-CV-Enhancer (GitHub → Vercel + Supabase)

Follow these steps in order.

---

## Part A — GitHub (you said this is done)

Repo on GitHub, e.g. `yourusername/AI-CV-enchancer`.

Make sure **`.env.local` is NOT pushed** (it is in `.gitignore`).

---

## Part B — Supabase (do once)

Dashboard: https://supabase.com/dashboard/project/ogxuuoxicvszwpatxoap

### B1. Run SQL migrations

**SQL Editor** → New query → paste and run **each file**:

1. `supabase/migrations/001_initial.sql`
2. `supabase/migrations/002_storage.sql`  
   - If buckets fail: **Storage** → New bucket → `generated-pdfs` (private) and `cv-uploads` (private), then run only the `create policy` lines from file 2.
3. `supabase/migrations/003_auth_trigger.sql`

### B2. Auth settings

**Authentication** → **Providers** → **Email** → Enabled.

**Authentication** → **URL configuration**:

| Field | Value |
|--------|--------|
| Site URL | `https://YOUR-APP.vercel.app` (update after first deploy) |
| Redirect URLs | `https://YOUR-APP.vercel.app/**` and `http://localhost:5173/**` |

### B3. API keys (for Vercel)

**Project Settings** → **API**:

- **Project URL** → `https://ogxuuoxicvszwpatxoap.supabase.co`
- **anon public** → copy for `VITE_SUPABASE_ANON_KEY`
- **service_role** → copy for `SUPABASE_SERVICE_ROLE_KEY` (server only)

Get **Gemini** key: https://aistudio.google.com/apikey

---

## Part C — Vercel import from GitHub

### C1. New project

1. Go to https://vercel.com/new
2. **Import** your `AI-CV-enchancer` GitHub repo
3. Configure:

| Setting | Value |
|---------|--------|
| **Framework Preset** | Vite (auto-detected) |
| **Root Directory** | `apps/web` ← **important** |
| **Build Command** | (leave default — uses `apps/web/vercel.json`) |
| **Output Directory** | `dist` |

Click **Deploy** once (it may fail without env vars — that is OK).

### C2. Environment variables

**Project** → **Settings** → **Environment Variables**

Add **all** of these for **Production**, **Preview**, and **Development**:

> **Preview URLs** (`*-git-main-*.vercel.app`) need the same env vars under **Preview** — not only Production. Missing `SUPABASE_SERVICE_ROLE_KEY` on Preview causes `401 Invalid or expired session` on `/api/extract`.

> **Critical:** `VITE_*` variables are baked into the frontend at **build time**.  
> If the app shows “Configuration required” or `supabaseUrl is required`, you added env vars **after** the last build — **Redeploy** with cache cleared.

| Name | Value | Notes |
|------|--------|--------|
| `VITE_SUPABASE_URL` | `https://ogxuuoxicvszwpatxoap.supabase.co` | **Required for UI** — must start with `VITE_` |
| `VITE_SUPABASE_ANON_KEY` | your anon key | **Required for UI** — not service_role |
| `SUPABASE_URL` | same as above | API routes |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key | **Secret** — never expose |
| `GEMINI_API_KEY` | `AIza...` | Platform AI quota |
| `ENCRYPTION_SECRET` | random 32+ chars | BYOK encryption |
| `GEMINI_MODEL` | `gemini-2.5-flash` | optional — do **not** use `gemini-1.5-pro` (removed) |
| `DAILY_LIMIT_PLATFORM` | `20` | optional |
| `DAILY_LIMIT_BYOK` | `100` | optional |
| `LATEX_COMPILE_ENABLED` | `true` | optional |

Then **Deployments** → latest deployment → **⋯** → **Redeploy** (check “Use existing build cache” off).

### C3. Confirm URLs

After deploy you get a URL like:

`https://ai-cv-enchancer.vercel.app`

Update Supabase **Site URL** and **Redirect URLs** (Part B2) with that URL.

---

## Part D — Test production

1. Open your Vercel URL
2. **Sign up** with email
3. **Onboarding** → paste CV or upload PDF
4. **New CV** → paste job description → **Generate preview**
5. **Approve & download PDF**

If AI fails: add `GEMINI_API_KEY` in Vercel and redeploy.

If PDF fails: use **Download .tex** and compile on Overleaf (compile API can be flaky).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails “Cannot find @ai-cv/…” | Root Directory must be `apps/web`; redeploy after `vercel.json` install command runs from repo root |
| 401 on API | Sign in again; check `SUPABASE_SERVICE_ROLE_KEY` |
| CORS / auth redirect | Add Vercel URL to Supabase redirect URLs |
| “No API key” | Set `GEMINI_API_KEY` or add your key in **Settings** (BYOK) |
| Empty after signup | Run `003_auth_trigger.sql` |

---

## Quick checklist

- [ ] SQL migrations 001–003 run in Supabase
- [ ] Email auth enabled
- [ ] GitHub repo pushed (no `.env.local`)
- [ ] Vercel project, Root Directory = `apps/web`
- [ ] All env vars set in Vercel
- [ ] Redeploy
- [ ] Supabase Site URL = Vercel URL
