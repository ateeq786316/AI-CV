# Supabase setup — project `ogxuuoxicvszwpatxoap`

## 1. Run migrations

In [Supabase Dashboard](https://supabase.com/dashboard/project/ogxuuoxicvszwpatxoap/sql/new) → **SQL Editor**, run each file **in order**:

1. `migrations/001_initial.sql`
2. `migrations/002_storage.sql`  
   - If bucket insert fails: **Storage** → create buckets `generated-pdfs` and `cv-uploads` (private), then re-run only the `create policy` statements from 002.
3. `migrations/003_auth_trigger.sql`

## 2. Auth

**Authentication** → **Providers** → enable **Email**.

Optional: disable “Confirm email” for faster local testing.

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
