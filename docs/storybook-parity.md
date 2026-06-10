# Storybook parity guide

This document defines how to reproduce the **same** AICADS Storybook catalog in:

1. **Monorepo dev** — [`playground/`](../playground/) inside this repository
2. **Consumer project** — any app that installs `@ai-ds/core` from GitHub/npm

Both paths use the shared **storybook-kit** at [`storybook/`](../storybook/).

## Architecture

```
@ai-ds/core/storybook/createMainConfig   ──► Storybook main.ts (stories + Vite)
@ai-ds/core/storybook/createPreview       ──► Theme toolbar + parameters
@ai-ds/core/tokens                       ──► CSS variables
@ai-ds/core/storybook/tailwind           ──► Tailwind content (components + contracts)
components/**/*.stories.tsx              ──► Story catalog (shipped with package)
```

| Mode | Stories glob | Tokens import |
|------|--------------|---------------|
| `monorepo` | `../../components/**`, `../../blocks/**`, `../../layout/**` | `@ai-ds/core/tokens` |
| `consumer` | `node_modules/@ai-ds/core/components/**`, `node_modules/@ai-ds/core/blocks/**` | `@ai-ds/core/tokens` |

CI runs **both** builds on every PR:

- `playground` — monorepo path
- `templates/consumer-storybook/fixture` — consumer path (`file:../../..`)

## Pinned toolchain

| Package | Version |
|---------|---------|
| react / react-dom | 18.3.1 |
| storybook | 8.6.18 |
| @storybook/react-vite | 8.6.18 |
| @storybook/addon-essentials | 8.6.18 |
| @storybook/addon-viewport | 8.6.18 |
| tailwindcss | 3.4.16 |
| vite | 5.4.11 |
| typescript | 5.7.2 |
| vaul | 1.1.2 |
| sonner | 2.0.7 |

See [`storybook/peer-versions.json`](../storybook/peer-versions.json).

## Mandatory CSS imports (preview.tsx)

Every Storybook preview **must** include:

```tsx
import '@ai-ds/core/tokens';
import '@ai-ds/core/storybook/engine-styles';
import '../src/index.css';
import { createPreview } from '@ai-ds/core/storybook/createPreview';

const preview = createPreview();
export default preview;
```

`engine-styles` resolves vaul/sonner CSS via Vite aliases in `createMainConfig` (works in monorepo + consumer).

## Checklist A — Monorepo (DS development)

- [ ] Clone AICADS repo
- [ ] `npm ci` (root)
- [ ] `cd playground && npm ci`
- [ ] `npm run storybook` → http://localhost:6006/ (if the port is busy, Storybook auto-picks the next free port — `--ci` is enabled in the script)
- [ ] **Do not** open `playground/storybook-static/index.html` in the browser — static build needs `npm run storybook:build` then a static server, or use `npm run storybook` for dev
- [ ] Theme toolbar: Light / Dark switches `data-theme` on `<html>`
- [ ] Spot-check: **Tooltip → FullMatrix**, **Tab → TicketTabGroup**, **Rating → Default**
- [ ] Marketing spot-check: **Screens/Marketing Landing → Aicads Pro Enterprise**, **Blocks/Marketing/NavbarBlock → Desktop**, **Blocks/Marketing/HeroBlock → Enterprise With Navbar**
- [ ] `npm run build-storybook` succeeds

## Checklist B — npm install (new consumer project)

- [ ] `npm install git+https://github.com/SCRUMUX/AICADS-PRO.git#v0.7.5`
- [ ] Copy [`templates/consumer-storybook/`](../templates/consumer-storybook/) into your app
- [ ] Install devDependencies from template `package.json`
- [ ] Add runtime deps: `react`, `react-dom`, `vaul`, `sonner` (or rely on `@ai-ds/core` transitive deps + explicit vaul for Storybook CSS path)
- [ ] `.storybook/main.ts` → `createMainConfig({ mode: 'consumer', ... })`
- [ ] `tailwind.config.cjs` → `require('@ai-ds/core/storybook/tailwind').default`
- [ ] `postcss.config.cjs` → `require('@ai-ds/core/storybook/postcss')`
- [ ] `npm run build-storybook`
- [ ] Visual spot-check: **Aicads Pro Enterprise** (desktop + mobile), **NavbarBlock Desktop**, **HeroBlock Enterprise With Navbar**

## Checklist C — Release to GitHub

- [ ] `npm run lint`
- [ ] `npm run manifest:check`
- [ ] `npm run tokens:check`
- [ ] `cd playground && npm run build-storybook`
- [ ] `cd templates/consumer-storybook/fixture && npm install && npm run build-storybook`
- [ ] Bump version in `package.json` + CHANGELOG
- [ ] `git tag vX.Y.Z && git push origin vX.Y.Z`
- [ ] Fresh-dir smoke test: install tagged package, copy template, build

## Tokens pipeline

```bash
npm run tokens:build   # regenerate config/css-variables/tokens.css from ai-ds-spec.json
npm run tokens:check   # CI gate — fails if tokens.css is stale
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Components unstyled / no colors | Tailwind purge missed classes | Extend `@ai-ds/core/storybook/tailwind`; do not drop `components/**` or `contracts/**` from content |
| Dark theme same as light | Missing preview decorator | Use `createPreview()` from storybook-kit |
| Drawer broken | Missing vaul CSS | Add `../node_modules/vaul/style.css` in preview |
| Toast broken | Missing sonner CSS | `import 'sonner/dist/styles.css'` |
| Duplicate React errors | Two React copies | `createMainConfig` sets `resolve.dedupe` + React alias |
| Consumer stories empty | Wrong mode or missing `@ai-ds/core` | Use `mode: 'consumer'`; verify `node_modules/@ai-ds/core/components` exists |

## Story inventory

Stories live under `components/primitives/**/*.stories.tsx` (~50+ files). Layout stories pattern is registered but no layout stories exist yet.

## Baseline verification (2026-05-25, v0.7.5)

| Check | Result |
|-------|--------|
| `npm run lint` | pass |
| `npm run manifest:check` | pass (63 components, 53 contracts) |
| `npm run tokens:check` | pass |
| `playground build-storybook` | pass |
| `consumer fixture build-storybook` | pass |
