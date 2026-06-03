# Supabase setup — project `ogxuuoxicvszwpatxoap`

## 1. Run migrations

In [Supabase Dashboard](https://supabase.com/dashboard/project/ogxuuoxicvszwpatxoap/sql/new) → **SQL Editor**, run each file **in order**:

1. `migrations/001_initial.sql`
2. `migrations/002_storage.sql`  
   - If bucket insert fails: **Storage** → create buckets `generated-pdfs` and `cv-uploads` (private), then re-run only the `create policy` statements from 002.
3. `migrations/003_auth_trigger.sql`
4. `migrations/004_fix_signup_profiles.sql` ← run if signup returns **500**

## 2. Auth

**Authentication** → **Providers** → enable **Email**.

**If signup shows 500:** run `004_fix_signup_profiles.sql`, then check **Logs → Postgres** in Supabase.

**If signup shows 400:** user may already exist, or password too weak.

For faster testing (recommended): **Authentication** → **Providers** → **Email** → turn **OFF** “Confirm email”.

If you see `Error sending confirmation email`, email confirmation is ON but Supabase has no SMTP — disable confirm email or configure SMTP under **Project Settings → Authentication → SMTP**.

## 3. Environment

`apps/web/.env.local` is already configured with your project URL and keys.

Add your **Gemini API key**:

```
GEMINI_API_KEY=AIza...
```

## 4. Security

If `service_role` was ever posted in chat or GitHub, rotate it:

**Project Settings** → **API** → **service_role** → regenerate, then update `.env.local` and Vercel env vars.

Never put `service_role` in frontend code or `VITE_*` variables.
