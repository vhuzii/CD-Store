# Developer setup (from scratch)

This guide explains how to run **Vinyl Vibe Market** locally after cloning the repository, including creating your own Supabase project and applying the database schema.

## Prerequisites

- **Node.js** 18 or newer (20 LTS is a good default) and **npm**
- A **[Supabase](https://supabase.com)** account (free tier is enough)
- For Google sign-in: a **[Google Cloud](https://console.cloud.google.com)** project with OAuth client credentials

## 1. Clone and install

```bash
git clone <repository-url>
cd Project
npm install
```

## 2. Create a Supabase project

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and choose **New project**.
2. Pick an organization, set a **database password** (store it somewhere safe), region, and project name.
3. Wait until the project finishes provisioning.

## 3. Apply the database migration

The app expects a `public.profiles` table and related RLS policies (see `supabase/migrations/`).

**Option A — SQL Editor (simplest)**

1. In the dashboard: **SQL Editor** → **New query**.
2. Paste the full contents of `supabase/migrations/20260308152557_8256c3c4-2ca8-4a3b-87d9-52735097295d.sql`.
3. Run the query. It should complete without errors.

**Option B — Supabase CLI**

If you use the [Supabase CLI](https://supabase.com/docs/guides/cli), you can link this repo’s `supabase/` folder to your project and push migrations. Update `supabase/config.toml` `project_id` to match your project reference, then run `supabase db push` (see official CLI docs for `link` and authentication).

## 4. Environment variables

1. In Supabase: **Project Settings** → **API**.
2. Copy **Project URL** and the **anon public** key (not the `service_role` key).

Create a `.env` file in the project root (never commit real keys):

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Source |
|----------|--------|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | anon public key |
| `VITE_SUPABASE_PROJECT_ID` | Optional; the project ref substring from the URL (e.g. `abcdxyz` from `https://abcdxyz.supabase.co`) |

`.env` is listed in `.gitignore` so secrets stay local.

## 5. Configure Google OAuth (required for “Sign in with Google”)

The app uses [Supabase Auth](https://supabase.com/docs/guides/auth) with the **Google** provider.

### 5.1 Google Cloud Console

1. Create or open a project in [Google Cloud Console](https://console.cloud.google.com).
2. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
3. Application type: **Web application**.
4. Under **Authorized redirect URIs**, add exactly:

   `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`

   Replace `<YOUR_PROJECT_REF>` with the same ref as in your Supabase URL.

5. Save and note the **Client ID** and **Client secret**.

### 5.2 Supabase dashboard

1. **Authentication** → **Providers** → **Google**.
2. Enable Google and paste the **Client ID** and **Client secret** from Google.
3. **Authentication** → **URL Configuration**:
   - **Site URL**: your app origin for local dev, e.g. `http://localhost:5173`
   - **Redirect URLs**: add `http://localhost:5173/**` or explicitly `http://localhost:5173/auth` so the redirect after OAuth is allowed

Without these steps, Google sign-in will fail or redirect incorrectly.

## 6. Run the app

```bash
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`). Use **Вхід** (auth) and **Увійти через Google** to test login.

Other useful commands:

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run Vitest |
| `npm run lint` | ESLint |

## 7. Troubleshooting

- **Blank screen or Supabase errors in the console**  
  Check that `.env` exists, variable names match `.env.example`, and you restarted `npm run dev` after changing env vars.

- **“Invalid API key” or CORS**  
  Confirm you used the **anon** key, not `service_role`, and the **Project URL** is correct.

- **Google login fails or loops**  
  Verify the Google redirect URI includes `/auth/v1/callback` on your Supabase host, and Supabase **Redirect URLs** include your local origin and `/auth`.

- **Profile not found after login**  
  Ensure the SQL migration ran successfully and the trigger `on_auth_user_created` exists so new users get a `profiles` row.

## 8. Notes on Lovable

This repository was scaffolded with [Lovable](https://lovable.dev). Local development uses **Supabase’s** `signInWithOAuth` flow so Google login works on `localhost` without Lovable’s hosted OAuth broker. The file `src/integrations/lovable/index.ts` is kept for reference but is not required for the current auth screen.

## Security reminder

If `.env` with real keys was ever committed to a public repository, rotate the **anon** key in Supabase (**Settings** → **API** → reset) and update your local `.env`. Never commit `.env` or expose the `service_role` key in frontend code.
