# DAMIAT Landing

Production landing for [DAMIAT](https://github.com/SCRUMUX/damiat-landing).

**Live site:** https://damiat-landing.vercel.app/

## Structure

- `core/` — AICADS subset synced from `DAMIAT/DAMIAT` (tokens, components, hooks, pattern blocks, fixtures, demo assets)
- `site/` — Vite app rendering `DamiatLandingPage`

## DAMIAT blocks in `core/`

After clone + install, all blocks are available via `@ai-ds/core/blocks` (alias `@damiat/core` in `site/`):

| Screen | Import |
|--------|--------|
| Landing | `DamiatLandingPage` |
| Login | `DamiatLoginPage`, `LoginBlock` |
| Case detail | `DamiatCaseDetailPage`, `CaseStudy*` blocks |
| Cabinet | `DamiatCabinetPage`, `MonitoringWorkspaceBlock`, `CabinetStatsStrip` |
| Admin | `DamiatAdminPage`, `AppShellBlock`, `AdminContent*`, `AdminUsers*`, `AdminPartners*` |

Fixtures: `damiatLandingFixtures`, `damiatLoginFixtures`, `damiatCaseDetailFixtures`, `damiatCabinetFixtures`, `damiatAdminFixtures`.

Each block folder includes `*.stories.tsx` for Storybook.

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

After changes in `DAMIAT/DAMIAT`, mirror into `core/`:

- Copy new/changed folders under `blocks/marketing/`, `blocks/_shared/`, `hooks/`, `recipes/`
- Sync `blocks/index.ts`, `ai-patterns.json`, `generated-icons/`, demo PNG assets
- Run `npm run patterns:check` in `core/`
- Run `npm run build` in `site/`
- Commit and push

Exclude from sync: `node_modules`, `playground`, `.cursor`, `figma-plugin`, `.github`.
