# DAMIAT Landing

Production landing for [DAMIAT](https://github.com/SCRUMUX/damiat-landing).

**Live site:** https://damiat-landing.vercel.app/

## Structure

- `core/` — AICADS subset (synced from `DAMIAT/DAMIAT`, landing-related packages only)
- `site/` — Vite app rendering `DamiatLandingPage`

## Local development

```bash
cd site
npm install
npm run dev
```

## Build

```bash
cd site
npm run build
```

## Deploy

Push to `master` — Vercel auto-deploys via root `vercel.json`.

Manual: `npx vercel deploy --prod --scope scrumxs-projects` from repo root.

## Sync core from Storybook monorepo

After changes in `DAMIAT/DAMIAT`, mirror into `core/` (exclude `node_modules`, `playground`, etc.) and commit.
