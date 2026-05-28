# Architecture — @ai-ds/core

AICADS is a **token-driven, contract-driven, source-first React design
system**. As of `v0.4.0` its behavior layer is powered by Radix UI,
cmdk, vaul and sonner — but **none of that surfaces in the public API**.

---

## 1. Three layers

```
┌──────────────────────────────────────────────────────────────────┐
│  Public AICADS surface  (consumers import from here)             │
│  --------------------                                            │
│  @ai-ds/core/components/<Name>   ─►  components/primitives/<N>/  │
│  @ai-ds/core/tokens              ─►  config/css-variables/       │
│  @ai-ds/core/contracts/<Name>    ─►  contracts/components/       │
│  @ai-ds/core/manifest            ─►  ai-manifest.json            │
└────────────────────────────────────┬─────────────────────────────┘
                                     │ semantic JSX, tokens, props
                                     ▼
┌──────────────────────────────────────────────────────────────────┐
│  AICADS primitives  (token + contract glue)                       │
│  --------------------                                            │
│  components/primitives/<Name>/<Name>.tsx                         │
│     - reads contract from contracts/components/<Name>.json       │
│     - composes classes via findClasses(rules, { state, size })   │
│     - composes behavior via `_internal/` adapters                │
└────────────────────────────────────┬─────────────────────────────┘
                                     │ asChild / composition
                                     ▼
┌──────────────────────────────────────────────────────────────────┐
│  Internal behavior substrate  (components/primitives/_internal/) │
│  --------------------                                            │
│  Popover/RadixPopover.tsx       (@radix-ui/react-popover)        │
│  Tooltip/RadixTooltip.tsx       (@radix-ui/react-tooltip)        │
│  Dialog/RadixDialog.tsx         (@radix-ui/react-dialog)         │
│  Checkbox/RadixCheckbox.tsx     (@radix-ui/react-checkbox)       │
│  RadioGroup/RadixRadioGroup.tsx (@radix-ui/react-radio-group)    │
│  Switch/RadixSwitch.tsx         (@radix-ui/react-switch)         │
│  Slider/RadixSlider.tsx         (@radix-ui/react-slider)         │
│  Select/RadixSelect.tsx         (@radix-ui/react-select)         │
│  Accordion/RadixAccordion.tsx   (@radix-ui/react-accordion)      │
│  Tabs/RadixTabs.tsx             (@radix-ui/react-tabs)           │
│  ScrollArea/RadixScrollArea.tsx (@radix-ui/react-scroll-area)    │
│  Command/Cmdk.tsx               (cmdk)                           │
│  Drawer/VaulDrawer.tsx          (vaul)                           │
│  Toast/SonnerToast.tsx          (sonner)                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. The isolation contract

> **Behavior libraries may be imported only inside
> `components/primitives/_internal/**`.**

This is enforced by `no-restricted-imports` in the root `.eslintrc.cjs`:

```js
const RESTRICTED_INTERNAL_ONLY = [
  '@radix-ui/*',
  'cmdk',
  '@floating-ui/*',
  'sonner',
  'vaul',
  'class-variance-authority',
  'input-otp',
];
```

Public primitives consume these libraries **only** through the adapters
exposed from `_internal/index.ts`. Consumers never see them.

### Why
1. **Stable public API.** Radix major upgrades don't ripple to AICADS users.
2. **AI / Figma plugin compatibility.** Generated code targets the AICADS
   surface only — see [`ai-manifest.json`](./ai-manifest.json).
3. **Bundle hygiene.** A consumer using only `Button` and `Badge` doesn't
   pull Radix Dialog or sonner.
4. **Replaceable engine.** Any adapter can be swapped (e.g. Radix →
   Headless UI) without touching primitive code.

---

## 3. Contracts

Each primitive has a JSON contract at
`contracts/components/<Name>.contract.json` describing its variant axes,
state matrix and the exact Tailwind classes per `(state × size × ...)`
combination. The primitive consumes this contract via:

```ts
import contract from '../../../contracts/components/<Name>.contract.json';
import { findClasses, type VR } from '../_shared';

const rules = (contract.variantRules || []) as unknown as VR[];

// inside render
const vc = findClasses(rules, { state, size });
```

This means **styling is data**. The Figma plugin and AI tools can
generate the contract from designs; the React component code stays
contract-driven and never hard-codes colors or spacing.

---

## 4. Tokens

CSS variables in `config/css-variables/tokens.css` are the only color /
spacing / radius / shadow source. Light/dark themes flip via
`data-theme="light|dark"` on `<html>`.

```css
:root[data-theme="dark"] {
  --color-bg-base: #0f172a;
  --color-text-primary: #f8fafc;
  /* … */
}
```

Tailwind's `theme.extend.colors` reads these variables; primitives use
arbitrary-value classes like `bg-[var(--color-surface-2)]`.

---

## 5. AI manifest

`ai-manifest.json` is a machine-readable index of all public primitives:

```json
{
  "components": {
    "Checkbox": {
      "role": "form.checkbox",
      "engine": "@radix-ui/react-checkbox",
      "contract": "Checkbox.contract.json"
    }
  }
}
```

External AI code generators (Figma plugin, Replit, etc.) read this file
to know which primitives exist, what their semantic role is, and which
contract drives their styling.

---

## 6. Source-first distribution

There is no build step required for consumers. `package.json` `exports`
maps every public path directly to TypeScript source — the consumer's
Vite/webpack/tsc compiles AICADS along with their app. The `dist/`
folder, when present, contains a pre-compiled mirror for ad-hoc CI use.

---

## 7. Playground

`playground/` contains a Storybook 8 + Vite workspace that consumes
AICADS through its public paths (just like a real consumer would). Run:

```bash
cd playground
npm install
npm run storybook   # http://localhost:6006/
```

The playground is **not** part of the npm package.

---

## 8. CI guards (v0.5.0+)

The system optimization layer makes every architectural invariant
machine-checkable. The full pipeline lives in
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) (fast guard
job) and [`.github/workflows/chromatic.yml`](./.github/workflows/chromatic.yml)
(VRT).

| Guard                | Script                          | Fails on                                                                                      |
| -------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| Isolation contract   | `npm run lint`                  | Any non-`_internal/` file importing Radix/cmdk/vaul/sonner/Floating UI/input-otp/cva          |
| Token enforcement    | `npm run lint`                  | Numeric pixel literal in `style={{...}}`, Tailwind arbitrary value without `var(--*)`, or hex color in a public primitive |
| Manifest sync        | `npm run manifest:check`        | `ai-manifest.json` drifts from `components/index.ts` + `contracts/components/`                |
| API surface freeze   | `npm run api:check`             | `etc/ai-ds-core.api.md` is out of sync with the current `src/index.ts` exports                |
| Visual regression    | Chromatic + storybook test-runner | Any Storybook snapshot diffs > 0.2% (threshold from `.chromatic.config.json`)               |

### Lint rule modules

- **[`eslint-rules/no-hardcoded-tokens.cjs`](./eslint-rules/no-hardcoded-tokens.cjs)** —
  custom rule loaded via `--rulesdir`. Allows `0`, `auto`, `%`,
  `calc()` with `var(--*)`, viewport units (`vh|vw|vmin|vmax`) and
  Tailwind tokens whose argument is `var(--*)`.
- **[`.eslintrc.cjs`](./.eslintrc.cjs)** — wires up the rule + the
  built-in `no-restricted-imports`.
- **[`aicads.eslintrc.shared.cjs`](./aicads.eslintrc.shared.cjs)** —
  shareable variant for consumer projects (exported as
  `@ai-ds/core/eslint-config`).

### Manifest regeneration

```bash
npm run manifest:build       # rewrites ai-manifest.json from source
npm run manifest:check       # CI mode: fails on drift
npm run figma:embed-manifest # refreshes the Figma plugin's embedded snapshot
```

### Public API snapshot

```bash
npm install --save-dev @microsoft/api-extractor typescript
npm run api:extract          # rewrites etc/ai-ds-core.api.md
npm run api:check            # CI mode: fails on drift
```

See [`docs/api-surface.md`](./docs/api-surface.md).

### Visual regression

See [`docs/vrt.md`](./docs/vrt.md).
