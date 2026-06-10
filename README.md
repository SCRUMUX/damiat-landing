# DAMIAT Landing

Production landing for [DAMIAT](https://github.com/SCRUMUX/damiat-landing).

**Live site:** https://damiat-landing.vercel.app/

## Architecture (child project)

| Package | Source | Role |
|---------|--------|------|
| `@ai-ds/core` | [SCRUMUX/AICADS-PRO](https://github.com/SCRUMUX/AICADS-PRO) | Design system — primitives, generic blocks, tokens |
| `@damiat/product` | `site/product/` in this repo | DAMIAT-only pages, calculator, fixtures, demo assets |
| `site/` | Vite app | Deploy target (`DamiatLandingPage`) |

Do **not** maintain a full copy of AICADS in this repo. The legacy `core/` folder is deprecated — use `site/product/` + `@ai-ds/core`.

## Local development

```bash
# Clone AICADS-PRO next to damiat-landing (or set git dependency in site/package.json)
cd site
npm install
npm run dev
```

`site/package.json` uses `file:../../../AICADS-publish` for local `@ai-ds/core`. For CI/Vercel, switch to:

```json
"@ai-ds/core": "git+https://github.com/SCRUMUX/AICADS-PRO.git#v0.7.6"
```

## Build & deploy

```bash
cd site
npm run build
```

Push to `master` — Vercel auto-deploys via root `vercel.json`.

## Promoting blocks upstream

Reusable patterns (login, case studies, admin) live in AICADS-PRO as generic templates. See [AICADS block promotion](https://github.com/SCRUMUX/AICADS-PRO/blob/main/docs/block-promotion.md).

## Deprecated paths

| Path | Status |
|------|--------|
| `core/` | Deprecated vendored DS copy — do not sync from `DAMIAT/DAMIAT` |
| `DAMIAT/DAMIAT` (sibling monorepo) | Retired fork — use AICADS-PRO + this repo only |
