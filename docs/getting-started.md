# Getting started with AICADS PRO

This guide covers clone/download workflows for contributors and consumers of `@ai-ds/core`.

## 1. Clone and run Storybook locally

```bash
git clone https://github.com/SCRUMUX/AICADS-PRO.git
cd AICADS-PRO
npm ci
cd playground && npm ci && cd ..
npm run storybook
```

Open **http://localhost:6006/** after the terminal shows `Storybook … started`.

If port 6006 is busy, `scripts/storybook-dev.mjs` frees it automatically and runs with `--ci` (no interactive prompt).

**Do not** open `playground/storybook-static/index.html` directly — use `npm run storybook` for dev, or `npm run storybook:build` plus a static server for production preview.

## 2. Install in your project

```bash
npm install git+https://github.com/SCRUMUX/AICADS-PRO.git#v0.7.5
```

Import tokens once in your app entry:

```tsx
import '@ai-ds/core/tokens';
```

Extend the Tailwind preset:

```js
// tailwind.config.cjs
module.exports = {
  presets: [require('@ai-ds/core/tailwind')],
  content: ['./src/**/*.{ts,tsx}'],
};
```

Import primitives:

```tsx
import { Button } from '@ai-ds/core/components/Button';
import { HeroBlock } from '@ai-ds/core/blocks/HeroBlock';
```

## 3. Consumer Storybook (same catalog as monorepo)

Copy [`templates/consumer-storybook/`](../templates/consumer-storybook/) into your app, then:

```bash
npm install
npm run storybook        # dev
npm run build-storybook  # static
```

Key files:

- `.storybook/main.ts` → `createMainConfig({ mode: 'consumer', ... })`
- `.storybook/preview.tsx` → import `@ai-ds/core/tokens` + `createPreview()`
- `tailwind.config.cjs` → `require('@ai-ds/core/storybook/tailwind').default`

Full checklists: [storybook-parity.md](./storybook-parity.md).

## 4. ESLint isolation (recommended)

Block direct imports of Radix, cmdk, vaul, sonner in consumer code:

```js
// .eslintrc.cjs
module.exports = {
  extends: [require.resolve('@ai-ds/core/eslint-config')],
};
```

Use AICADS primitives instead (`Modal`, `Drawer`, `CommandPalette`, `Toaster` + `toast()`).

## 5. AI page assembly

Load the pattern catalog and manifest:

```ts
import patterns from '@ai-ds/core/patterns' assert { type: 'json' };
import manifest from '@ai-ds/core/manifest';
```

For marketing pages, pick a pattern from `patterns.patterns` (e.g. `marketing.hero.enterprise`) and import the matching block:

```tsx
import { HeroBlock } from '@ai-ds/core/blocks/HeroBlock';
import { LandingPageTemplate } from '@ai-ds/core/blocks/LandingPageTemplate';
```

Never hand-roll section spacing — use blocks + recipes from `@ai-ds/core/recipes`.

See [pattern-layer.md](./pattern-layer.md) for layout contracts and page templates.

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Components unstyled | Import `@ai-ds/core/tokens`; extend Tailwind preset |
| Storybook port conflict | Use `@ai-ds/core/scripts/storybook-dev.mjs` (included in template) |
| Consumer stories empty | Set `mode: 'consumer'` in `createMainConfig` |
| Dark theme broken | Use `createPreview()` from `@ai-ds/core/storybook` |

More: [storybook-parity.md](./storybook-parity.md#troubleshooting).
