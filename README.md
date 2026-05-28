# DAMIAT Landing

Production landing page for [DAMIAT](https://github.com/SCRUMUX/damiat-landing) — deployed on Vercel.

## Structure

- `core/` — AICADS design system subset required by the landing page
- `site/` — Vite + React app that renders `DamiatLandingPage`

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

## Deployment

- **GitHub Pages (live):** https://scrumux.github.io/damiat-landing/
- **Vercel:** import https://github.com/SCRUMUX/damiat-landing — config is in root `vercel.json` (builds from `site/`).
