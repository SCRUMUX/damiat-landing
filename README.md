# @ai-ds/core v0.7.6

**AICADS PRO** — token-driven React design system: 57+ primitives (buttons, forms, modals) and 24 marketing blocks (Hero, Navbar, Solutions, FAQ…).

**Why:** one token-driven UI for products and AI page assembly. Behavior engines (Radix, vaul, sonner) stay behind the semantic API — your app never imports them directly.

**Quick start:**

1. `npm install git+https://github.com/SCRUMUX/AICADS-PRO.git#v0.7.6`
2. `import '@ai-ds/core/tokens'`
3. Browse Storybook: [scrumux.github.io/AICADS-PRO](https://scrumux.github.io/AICADS-PRO/) or run locally (see [Getting started](./docs/getting-started.md))
4. For landing pages — import blocks from `@ai-ds/core/blocks/*` using the catalog at `@ai-ds/core/patterns`

Full setup guide: [docs/getting-started.md](./docs/getting-started.md)

## Installation

```bash
npm install git+https://github.com/SCRUMUX/AICADS-PRO.git#v0.7.6
```

## Importing components

```tsx
import { Button } from '@ai-ds/core/components/Button';
import { Modal } from '@ai-ds/core/components/Modal';
import { Tabs, Tab, TabList, TabPanel } from '@ai-ds/core/components/Tab';
import { SearchIcon } from '@ai-ds/core/icons';

// Or the full barrel:
import { Button, Checkbox, Slider, Toaster } from '@ai-ds/core/components';
```

## Available exports

| Import path | Contents |
|---|---|
| `@ai-ds/core/components/<Name>` | A single primitive (preferred) |
| `@ai-ds/core/components` | Full barrel (all 57 primitives) |
| `@ai-ds/core/icons` | All SVG icon components |
| `@ai-ds/core/tokens` | CSS variables (`tokens.css`) |
| `@ai-ds/core/tailwind` | Tailwind preset |
| `@ai-ds/core/contracts/<Name>` | JSON contract for `<Name>` |
| `@ai-ds/core/manifest` | `ai-manifest.json` — AI semantic registry |
| `@ai-ds/core/patterns` | `ai-patterns.json` — block patterns + page templates |
| `@ai-ds/core/blocks/<Name>` | Composed sections (`HeroBlock`, `LandingPageTemplate`, …) |
| `@ai-ds/core/blocks` | Full blocks barrel |
| `@ai-ds/core/recipes` | Spacing recipes (`resolveRecipe`, `SPACING_RECIPES`) |
| `@ai-ds/core/hooks` | React hooks (`useBreakpoint`, `useClickOutside`, …) |
| `@ai-ds/core/shared` | `cn`, `findClasses`, `IconSlot`, `ScrollArea`, … |
| `@ai-ds/core/layout` | Layout system |
| `@ai-ds/core/behaviors` | Behavior modules |
| `@ai-ds/core/eslint-config` | Shareable ESLint config (blocks direct Radix/cmdk/vaul/sonner imports in consumer code) |
| `@ai-ds/core/storybook` | Storybook kit (`createMainConfig`, `createPreview`, `StoryFrame`) |
| `@ai-ds/core/storybook/tailwind` | Tailwind config for Storybook consumers |
| `@ai-ds/core/storybook/index.css` | Tailwind entry for Storybook |

## Consumer ESLint config

Add the AICADS shareable config to your project to enforce that consumer
code never bypasses the AICADS surface and reaches into the underlying
behavior engines (Radix, cmdk, vaul, sonner, Floating UI, input-otp,
class-variance-authority):

```js
// .eslintrc.cjs in your consumer app
module.exports = {
  extends: [require.resolve('@ai-ds/core/eslint-config')],
};
```

This makes `import { Dialog } from '@radix-ui/react-dialog'` (and similar)
fail with a clear migration message pointing to the AICADS semantic API.

## Design tokens

```css
/* Colors */    var(--color-text-primary), var(--color-brand-primary)
/* Spacing */   var(--space-4), var(--space-8), var(--space-16)
/* Radius */   var(--radius-default), var(--radius-pill), var(--radius-md-plus)
/* Z-index */   var(--z-header: 30), var(--z-popover: 40), var(--z-modal: 50)
```

Theme switch:

```html
<html data-theme="light"> … </html>
<html data-theme="dark">  … </html>
```

## What's new in v0.7.5

- **Round ↗ arrow controls** — `BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS` + `BlockArrowUpRightIcon` with 45° rotate on hover (Blog, Solutions, Trust, FAQ).
- **Meta pill contract** — `BLOCK_META_PILL_CLASS` for Solutions catalog and similar chrome.
- **ChooseUs / Solutions polish** — icon/body layout fix; catalog cards use standard inset tier.
- **Storybook dev** — `scripts/storybook-dev.mjs` frees busy ports and runs with `--ci` (no interactive prompt).

See [CHANGELOG.md](./CHANGELOG.md#075--2026-05-25) for full release notes.

## Technical overview

**Architecture**

```
Consumer app
  └─ @ai-ds/core/components/*     ← public primitives (contract-driven styling)
  └─ @ai-ds/core/blocks/*          ← composed marketing sections
  └─ @ai-ds/core/tokens            ← CSS variables (ai-ds-spec.json → tokens.css)
  └─ @ai-ds/core/patterns          ← ai-patterns.json (35 patterns, 3 page templates)
  └─ @ai-ds/core/manifest          ← ai-manifest.json (63 components, engines map)
  └─ @ai-ds/core/eslint-config     ← blocks direct Radix/cmdk/vaul/sonner imports

Internal (never import from consumer):
  components/primitives/_internal/  ← Radix, cmdk, vaul, sonner adapters
```

**Distribution:** source-first TypeScript; consumers bundle via Vite/Next. Versioned git tags (`#v0.7.6`).

**Quality gates (CI on every PR/push to main):**

- ESLint: `no-restricted-imports` + `no-hardcoded-tokens` on primitives/blocks
- `manifest:check`, `tokens:check`, `patterns:check`, `api:check`
- Storybook build: monorepo playground + consumer fixture

**Pattern layer:** blocks use [`SectionShell`](./blocks/_shared/SectionShell.tsx) + spacing recipes. Layout contract in [`blockLayout.ts`](./blocks/_shared/blockLayout.ts) — content column, card inset tiers, chrome radius roles. Details: [docs/pattern-layer.md](./docs/pattern-layer.md).

**AI integration:**

- `ai-manifest.json` — semantic roles + behavior engines + contract paths per primitive
- `ai-patterns.json` — block variants, primitives used, Storybook refs, page template section order
- Contracts in `contracts/components/` drive tokenized appearance

**Enterprise reference:** `marketing.landing.enterprise` page template — overlay navbar, brand hero, events, solutions catalog, trust, blog slider, contact hero, enterprise footer.

## Architecture

Source-first: consumers import TypeScript source, processed by their
Vite/bundler. See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full
layered model (public surface → AICADS primitives → `_internal/`
behavior adapters).

## DAMIAT product landing

Product landing for DAMIAT (ethylene generator + storage platform) ships as a composed screen:

```tsx
import { DamiatLandingPage } from '@ai-ds/core/blocks/DamiatLandingPage';
import { buildDamiatLandingProps } from './blocks/marketing/damiatLandingIntegrations';
```

- **Storybook:** `Screens / DAMIAT Product Landing` — Desktop, Tablet, Mobile viewports
- **Fixtures:** `blocks/marketing/damiatLandingFixtures.ts`
- **Handoff guide:** [docs/DAMIAT-landing-handoff.md](./docs/DAMIAT-landing-handoff.md)
- **Consumer app (Vite):** `templates/damiat-consumer-app/` — `npm ci && npm run dev`

## Playground (Storybook)

**Live (GitHub Pages):** [scrumux.github.io/AICADS-PRO](https://scrumux.github.io/AICADS-PRO/) — deployed from `main` via GitHub Actions.

### Local dev (verified)

From repo root:

```bash
npm ci
cd playground && npm ci && cd ..
npm run storybook
```

Open **http://localhost:6006/** only after the terminal shows `Storybook … started`.

Consumer fixture (optional):

```bash
cd templates/consumer-storybook/fixture && npm ci && cd ../../..
npm run storybook:consumer
```

**Common mistakes:** opening `playground/storybook-static/index.html` directly (blank/broken UI); running Storybook without `playground/npm ci`; consumer Storybook without port cleanup (fixed — all paths use `scripts/storybook-dev.mjs` with port cleanup + `--ci`).

From the repo root you can also run `npm run storybook` (delegates to `playground/`).

### Storybook in a consumer project

Copy [`templates/consumer-storybook/`](./templates/consumer-storybook/) into your app, install the pinned Storybook toolchain, and run `build-storybook`. Full parity checklists: [docs/storybook-parity.md](./docs/storybook-parity.md).

CI builds both the monorepo playground and the consumer fixture on every PR.

See also [CHANGELOG.md](./CHANGELOG.md) for release history and
[components/primitives/_internal/README.md](./components/primitives/_internal/README.md)
for the isolation rules.
