# Setup Guide

## 1. Prerequisites

- Node.js 20+
- npm
- Supabase project
- Google Cloud project with Places and PageSpeed enabled (billing enabled)
- Gemini API key
- Stripe account (only if paid plans are enabled)

## 2. Required Environment Variables

### Core

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PAGESPEED_API_KEY`
- `GEMINI_API_KEY`

PageSpeed and accessibility checks are part of the default analysis flow.

### Billing (only if Stripe plans are enabled)

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_STARTER`
- `STRIPE_PRICE_ID_PRO`

### Scheduled Jobs Security (required in production)

- `ANALYSIS_WORKER_SECRET`
- `ADMIN_TASK_SECRET`

## 3. `.env.local` Template

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_PLACES_API_KEY=
GOOGLE_PAGESPEED_API_KEY=
GEMINI_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_STARTER=
STRIPE_PRICE_ID_PRO=

ANALYSIS_WORKER_SECRET=
ADMIN_TASK_SECRET=
```

## 4. Database Setup

Run SQL migrations from `supabase/migrations` in numeric order:

`001` -> `021`

## 5. Start the App

```bash
npm install
npm run build
npm start
```

## 6. Production Scheduler

Cron config is in `vercel.json`:

- `/api/analysis/worker` every 5 minutes
- `/api/admin/cleanup` daily at 03:00 UTC

The worker endpoint expects `x-worker-secret` when `ANALYSIS_WORKER_SECRET` is set.
The admin endpoint expects `x-admin-secret` when `ADMIN_TASK_SECRET` is set.

## 7. Operational Commands

```bash
npm run worker:run
npm run cleanup:run
```
