# AICADS Consumer Storybook Template

Copy this folder into your project (or use it as a starting point) to render
the full `@ai-ds/core` primitive catalog with identical styling to the AICADS
monorepo playground.

## Quick start

```bash
# 1. Install the design system (pin a git tag)
npm install git+https://github.com/SCRUMUX/AICADS-PRO.git#vX.Y.Z

# 2. Copy template files into your app
cp -r templates/consumer-storybook/.storybook ./.storybook
cp -r templates/consumer-storybook/src ./src
cp templates/consumer-storybook/tailwind.config.cjs .
cp templates/consumer-storybook/postcss.config.cjs .
cp templates/consumer-storybook/tsconfig.json .

# 3. Install Storybook toolchain (see package.json devDependencies)
npm install -D storybook@8.6.18 @storybook/react-vite@8.6.18 tailwindcss@3.4.16 ...

# 4. Run
npm run storybook
```

## What this template provides

| File | Role |
|------|------|
| `.storybook/main.mjs` | `createMainConfig({ mode: 'consumer' })` — loads stories from `node_modules/@ai-ds/core` |
| `.storybook/preview.tsx` | Theme toolbar + `@ai-ds/core/tokens` + vaul/sonner CSS |
| `tailwind.config.cjs` | Extends `@ai-ds/core/tailwind` content paths |
| `src/index.css` | Tailwind entry via `@ai-ds/core/storybook/index.css` |

See [docs/storybook-parity.md](../../docs/storybook-parity.md) for full checklists.

## Pattern blocks (v0.6+)

```tsx
import { HeroBlock } from '@ai-ds/core/blocks/HeroBlock';
import { LandingPageTemplate } from '@ai-ds/core/blocks/LandingPageTemplate';
```

See [docs/pattern-layer.md](../../docs/pattern-layer.md). Install tag `#v0.7.1` or newer.
