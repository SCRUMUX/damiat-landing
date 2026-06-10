# Changelog

All notable changes to @ai-ds/core are documented here.
Format follows [Semantic Versioning](https://semver.org/).

## [0.7.6] — 2026-05-26

> **ContactHero form fields** — inputs blend with glass panel (no opaque field fill).

### Fixed

- **ContactHeroFormField** — removed 8% on-brand fill on field shells; border-only on glass panel; `-webkit-autofill` override so browser autofill does not paint solid boxes.

## [0.7.5] — 2026-05-25

> **Chrome polish & Storybook dev** — round ↗ arrow controls, meta pill contract, ChooseUs/Solutions layout fixes, reliable local Storybook startup.

### Added

- **`BlockArrowUpRightIcon`** — shared straight ↗ arrow with `group-hover:rotate-45` ([`blocks/_shared/BlockArrowIcons.tsx`](blocks/_shared/BlockArrowIcons.tsx)).
- **`BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS`** — pill-shaped ↗ control for Blog, Solutions, Trust, FAQ.
- **`BLOCK_META_PILL_CLASS`** — shared meta pill chrome for Solutions catalog and similar labels.
- **`docs/getting-started.md`** — clone, install, consumer Storybook, AI assembly guide.

### Changed

- **Blog / Solutions / Trust / FAQ** — migrated ↗ and nav controls to round arrow chrome; chevron nav retains pill + brand hover.
- **Solutions catalog** — standard card inset tier; meta pills use `BLOCK_META_PILL_CLASS`.
- **ChooseUs** — icon/body flex layout (no absolute overlap).
- **README** — v0.7.5 install ref, quick-start intro, technical overview; consumer template pin `#v0.7.5`.

### Fixed

- **Local Storybook** — `scripts/storybook-dev.mjs` frees busy port 6006 and runs with `--ci` (no interactive Y/n exit).

## [0.7.4] — 2026-05-25

> **Card inset & radius contract** — unified padding tiers, ChooseUs grid fix, Solutions hover stability.

### Added

- **Inset contract** — `BLOCK_CARD_STANDARD_INSET_CLASS`, `BLOCK_CARD_COMPACT_INSET_CLASS` for consistent inner padding per card tier.
- **Square chrome control** — `BLOCK_CHROME_SQUARE_CONTROL_CLASS` for blog prev/next (`--radius-medium`, not card shell).

### Changed

- **ChooseUsBlock** — CSS grid mosaic (`desktop:` breakpoint, 6-col fr tracks); featured panel `shrink-0` + media bleed; section padding via CSS vars (no `!pt/!pb`).
- **SolutionCard** — hover hides body via opacity (reserved `min-h`); footer pinned in grid; desktop hover breakpoint aligned with gutters.
- **Card padding migration** — ChooseUs, WhyUs, Process, FAQ, Solutions, Trust, Services, Testimonials, Pricing, FeatureCard use shared inset classes.
- **Blog nav** — prev/next buttons use square chrome (`radius-medium`) instead of standard card shell.
- **Card radius** — outer shell responsive radius switches at `desktop` (1440px) alongside content gutters.
- **Docs** — `pattern-layer.md`: inset tier table, radius roles, horizontal edge exceptions.

### Fixed

- **ChooseUs layout** — no overflow/wrap at 1024–1439px; mosaic activates at desktop width only.
- **Solutions hover jump** — footer/arrow no longer reflows when description fades on hover.

## [0.7.3] — 2026-05-25

> **Pre-release block unification** — enterprise above-fold contract, shared card/glass micro-classes, consumer enterprise fixtures.

### Added

- **Block style micro-classes** — `BLOCK_CHROME_ICON_CHIP_CLASS`, `BLOCK_ON_BRAND_ICON_BUTTON_CLASS`, blog/solution pill helpers, `BLOCK_HERO_ENTERPRISE_MEDIA_WRAP_CLASS`, `BLOCK_SUPPORT_MOBILE_HERO_SHELL_CLASS`.
- **Enterprise landing exports** — `aicadsProEnterpriseLandingArgs`, `aicadsEnterpriseHeroDemoContent`, `withEnterpriseHeroMedia` from `@ai-ds/core/blocks`.
- **Consumer Storybook smokes** — `LandingEnterpriseConsumer`, `NavbarBlockConsumer` in `templates/consumer-storybook/fixture`.

### Changed

- **Card tier migration** — Events carousel, Blog, Solutions, Trust pillar chips use shared `blockLayout` classes.
- **HeroBlock solutions** — section padding via CSS variables + inline `style` (no Tailwind `!pt/!pb` overrides).
- **Effects/tokens** — enterprise CTA hover uses `shadow-elevation-2`; navbar min chrome documents `--space-64`; demo SVG palette via `DEMO_PALETTE`.
- **Docs** — `pattern-layer.md` and `storybook-parity.md` sync with MAF/navbar stacking contract and marketing spot-check stories.
- **Public API** — `HeroBlockProps.fillViewport`, `style`; `EventsBlockProps.sectionStyle`.

### Fixed

- **Enterprise above-fold** — navbar stacking (`--z-header`), glass overlay/solid, first-screen layout (approved in audit).
- **WhyUs decorative blur** — `WHY_US_DECORATIVE_HIGHLIGHT_CLASS` with tokenized blur radius.

## [0.7.2] — 2026-05-25

> **Enterprise navbar polish** — AICADS PRO mobile drawer, demo content, and distribution on `AICADS-PRO`.

### Added

- **`NavbarBlock` enterprise variant** — overlay/solid scroll surfaces, in-tree services mega menu, above-fold social rail, full-screen mobile drawer.
- **`marketingDemoContent.ts`** — shared AICADS-themed hero, features, CTA, footer, and partner logos for Storybook.
- **`defaultMobileOpen`** — Storybook-only prop to QA mobile drawer without interaction.
- **GitHub Pages Storybook** — live catalog at [scrumux.github.io/AICADS-PRO](https://scrumux.github.io/AICADS-PRO/).

### Changed

- **Mobile drawer insets** — header and body use `--grid-mobile-offset` / `--grid-tablet-offset` (same rhythm as `BLOCK_CONTENT_CLASS` on landing pages); fixes invalid `--space-grid-mobile-offset` token.
- **Demo copy** — navbar fixtures, landing stories, and pattern manifests use AICADS PRO content instead of cloud/hosting placeholders.
- **Repository distribution** — install URL points to `SCRUMUX/AICADS-PRO` (`git+https://github.com/SCRUMUX/AICADS-PRO.git#v0.7.2`).

### Fixed

- **`LandingPageTemplate`** — missing `cn` import broke overlay landing at runtime.
- **Navbar scroll detection** — listens to Storybook scroll roots; social icons without borders at 40×40 tap target.
- **Mobile drawer UX** — services expand/collapse animation, focus return to menu button, scroll lock, link tap closes drawer, 44×44 close control, Russian aria labels.
- **`tsconfig.api.json`** — include `@types/node` for dev-only `process.env` guards.
- **Radix adapters** — strip incompatible HTML attrs before spreading onto Radix roots (`radixDomProps.ts`).
- **`Rating`** — focus handler no longer reads `clientX` from `FocusEvent`.
- **`tailwind-merge`** — custom `text-style` group typed for API build.

## [0.7.1] — 2026-05-25

> **Storybook consumer fix** — npm/git installs can evaluate Storybook main config on Node 22+.

### Fixed

- **`createMainConfig.mjs`** — JS entry for consumer Storybook (`main.mjs`); Node no longer tries to strip TS from `node_modules`.
- **`storybook-prep.mjs`** — resolves the consumer project root when invoked from `node_modules/@ai-ds/core/scripts/`.
- **Consumer template** — `.storybook/main.mjs`, `prestorybook` / `prebuild-storybook` hooks, viewport addon in kit config.

## [0.7.0] — 2026-05-24

> **Marketing blocks v0.7** — 12 landing sections, unified layout contract, consumer Storybook parity.

### Added

- **7 Tier-1 blocks** — `NavbarBlock`, `LogoCloudBlock`, `StatsBlock`, `TestimonialsBlock`, `FAQBlock`, `HowItWorksBlock`, `NewsletterBlock`.
- **Layout contract** — `blockLayout.ts` (`BLOCK_CONTENT_CLASS`, start-aligned sections, logo tiles via `LogoMark`).
- **Page template** — `marketing.landing.saas` in `ai-patterns.json` (14 patterns).
- **Storybook** — `engine-styles`, `marketingViewports`, `storybook-dev.mjs`, GitHub Pages deploy workflow.
- **CI** — consumer fixture `prebuild-storybook` gate with `@storybook/addon-viewport`.

### Changed

- **SectionShell / BlockGrid** — unified 1440px content column; 3-up grids from 1024px.
- **All marketing blocks** — left-aligned headers (center reserved for `marketing.hero.centered` only).
- **LogoCloudBlock** — grid of `LogoMark` tiles instead of uppercase text labels.
- **Hero / Features / Pricing / CTA / Footer** — enriched props and stories.

### Removed

- **`AppShellBlock` / `AppSidebarBlock`** — deferred from pattern manifest (marketing focus).

## [0.6.0] — 2026-05-23

> **Pattern Layer** — distributable marketing/app blocks, spacing recipes, and AI pattern manifest.

### Added

- **`blocks/`** — `HeroBlock`, `FeaturesBlock`, `PricingBlock`, `CTABlock`, `FooterBlock`, `LandingPageTemplate`, `AppShellBlock`, `AppSidebarBlock` with Storybook stories.
- **`recipes/`** — named spacing recipes (`section.hero`, …) + `resolveRecipe()` for token-driven section rhythm.
- **`ai-patterns.json`** — pattern catalog + `marketing.landing.default` page template for Replit/AI.
- **Exports** — `@ai-ds/core/blocks/*`, `@ai-ds/core/recipes`, `@ai-ds/core/patterns`.
- **CI** — `npm run patterns:check`.
- **Docs** — [docs/pattern-layer.md](./docs/pattern-layer.md), [docs/migrations/v0.5-to-v0.6.md](./docs/migrations/v0.5-to-v0.6.md).

### Changed

- Storybook kit globs include `blocks/**/*.stories.*` (monorepo + consumer).
- `src/index.ts` re-exports layout, blocks, recipes from repo root (fixes broken `./layout` path).

## [0.5.1] — 2026-05-23

> **Storybook parity release** — distributable Storybook kit, token build pipeline, CI storybook gates.

### Features

- **`@ai-ds/core/storybook` kit** — `createMainConfig`, `createPreview`, `StoryFrame`, Tailwind/PostCSS wrappers for monorepo and consumer modes.
- **Consumer template** — [`templates/consumer-storybook/`](./templates/consumer-storybook/) + CI fixture proving npm-install parity.
- **Tokens pipeline** — `npm run tokens:build` / `tokens:check` regenerate and verify `config/css-variables/tokens.css` from `ai-ds-spec.json` (includes tooltip inverted tokens).
- **CI** — `build-storybook` jobs for playground and consumer fixture; `tokens:check` in guard pipeline.
- **Clean publish** — `files` whitelist in `package.json`; `dist/` removed from repo.

### Fixes

- **Tooltip** — theme-inverted tokens and unified arrow/bubble color via shared CSS variables on wrapper.

See [docs/storybook-parity.md](./docs/storybook-parity.md) for consumer setup checklists.

## [0.5.0] — 2026-05-22

> Phase 10 — **System Optimization Layer.** v0.5.0 makes AICADS
> strictly token-driven, single-Radix-aligned and visually deterministic,
> and locks every architectural invariant behind a CI guard.

### Breaking

- **`<Toast>` component removed.** The custom presentational `<Toast>`
  primitive was a duplicate of the sonner-backed surface. The public
  Toast API is now **`toast()` + `<Toaster>` only** (sonner-powered).

  ```diff
  - import { Toast } from '@ai-ds/core/components/Toast';
  - <Toast appearance="info" title="Hello" />
  + import { toast, Toaster } from '@ai-ds/core/components/Toast';
  + toast.info('Hello');
  + // Mount <Toaster /> once near the app root.
  ```

- **`<ScrollBar>` primitive is `@deprecated`** and emits a runtime
  `console.warn` at import time. Use
  [`@ai-ds/core/shared#ScrollArea`](./components/primitives/_shared/ScrollArea.tsx)
  (Radix-powered). Scheduled for removal in **v0.6.0**.

  ```diff
  - import { ScrollBar } from '@ai-ds/core/components/ScrollBar';
  + import { ScrollArea } from '@ai-ds/core/shared';
  ```

  Internal usages in `Dropdown`, `Autocomplete`, `Select`,
  `CommandPalette`, `Modal` and `Drawer` were already migrated.

### Features

- **AI manifest is now generated + verified by CI.** New
  [`scripts/build-manifest.mjs`](./scripts/build-manifest.mjs) and
  [`scripts/check-manifest-sync.mjs`](./scripts/check-manifest-sync.mjs)
  with `npm run manifest:build` / `npm run manifest:check`. The Figma
  plugin now ships an embedded snapshot of the manifest (refresh with
  `npm run figma:embed-manifest`) and validates every generation spec
  against it (warn by default, abort in **Strict mode**).
- **Single Skeleton contract.** New
  [`contracts/components/Skeleton.contract.json`](./contracts/components/Skeleton.contract.json)
  drives `SkeletonCard / Chart / List / Page / Table` from one source
  via `findClasses(rules, { component, size })`.
- **Tab × Tabs decoupling.** `Tab.contract.json` now models the
  `data-state ∈ { active, inactive }` axis against every `appearance`,
  and the runtime no longer hard-codes `brand` active-state when nested
  in `<Tabs>`. New Storybook matrix `TabGroupAppearanceMatrix` shows
  base / ghost / outline / brand active states.
- **Shareable consumer ESLint config** at
  [`aicads.eslintrc.shared.cjs`](./aicads.eslintrc.shared.cjs), exported
  as `@ai-ds/core/eslint-config`. Blocks direct imports of Radix /
  cmdk / vaul / sonner / Floating UI / input-otp / cva from consumer
  code.
- **VRT pipeline.** Chromatic + storybook test-runner + Playwright,
  threshold `0.002` (0.2%), see [`docs/vrt.md`](./docs/vrt.md) and the
  [Chromatic workflow](./.github/workflows/chromatic.yml).
- **Frozen public API surface.** `@microsoft/api-extractor` with
  [`api-extractor.json`](./api-extractor.json) and the snapshot at
  [`etc/ai-ds-core.api.md`](./etc/ai-ds-core.api.md). New scripts
  `api:extract` and `api:check`. See [`docs/api-surface.md`](./docs/api-surface.md).

### Fixes — token compliance (100%)

- **Avatar:** badge overlay rewritten on top of `Badge` tokens, no
  inline `style` left.
- **CircularProgress:** outer dimensions are now `var(--space-N)`
  classes; only SVG-internal `strokeWidth`/`fontSize` stay numeric
  (those are SVG units, not CSS pixels).
- **Modal / Drawer:** widths use `w-[var(--space-N)]`,
  `max-w-[calc(100vw-var(--space-32))]` and route body scroll through
  `<ScrollArea>` instead of native overflow.
- **EmptyState / Switch / Toaster / Tooltip / CommandPalette / Select /
  Autocomplete / Image / Pagination / Table / ListItem / DropdownItem /
  Chip / GridContainer / Textarea / Divider / table-tokens** — all
  inline pixel literals replaced with `var(--space-*)` / `var(--radius-*)`
  / `var(--font-size-*)` / `var(--line-height-*)`.
- **Storybook palette cleanup:** every hardcoded hex/RGB color in
  `components/primitives/**/*.stories.tsx` swapped for design-token
  CSS variables. New
  [`playground/.storybook/StoryFrame.tsx`](./playground/.storybook/StoryFrame.tsx)
  wrapper standardises story chrome.

### Architecture — CI guards

- **Token enforcement lint.** New custom rule
  [`eslint-rules/no-hardcoded-tokens.cjs`](./eslint-rules/no-hardcoded-tokens.cjs)
  forbids numeric pixel literals in `style={{...}}`, Tailwind arbitrary
  values without `var(--*)`, and hex colors in primitive components.
  Enabled at error level via `npm run lint`.
- **Single CI workflow.** [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)
  chains `lint` → `manifest:check` → `api:check`. VRT runs in a
  parallel [`chromatic.yml`](./.github/workflows/chromatic.yml).
- **Tokens.** Added `--space-400`, `--breakpoint-mobile-max`,
  `--breakpoint-tablet-max`, `--breakpoint-desktop` to back the
  remaining inline literals without forcing a visual diff.
- **Cursor rule** [`.cursor/rules/aicads-imports.mdc`](./.cursor/rules/aicads-imports.mdc)
  mirrors the shareable ESLint config for AI-assisted editors.

### Migration

See [`docs/migrations/v0.4-to-v0.5.md`](./docs/migrations/v0.4-to-v0.5.md)
for a single-page upgrade guide (Toast hard-delete + ScrollBar
deprecation are the only consumer-visible breakages).

## [0.4.0] — 2026-05-22

### Added — Radix-powered behavior engine

AICADS now uses **Radix UI / cmdk / vaul / sonner** as the internal
behavior substrate for form, overlay, navigation and disclosure
primitives. The public component surface, props, tokens and contracts
are **unchanged** — every existing import keeps working.

- New `_internal/` adapter layer (`components/primitives/_internal/`) —
  the only place in the repo where Radix UI / cmdk / vaul / sonner /
  Floating UI may be imported. Enforced by ESLint `no-restricted-imports`
  in the new root `.eslintrc.cjs`.
- `Popover`, `Tooltip`, `Modal`, `Dropdown` → `@radix-ui/react-popover` /
  `react-tooltip` / `react-dialog`.
- `Checkbox`, `RadioButton`+`RadioGroup`, `Switch`, `Slider`,
  `RangeSlider`, `Select` → corresponding Radix form primitives.
- `Autocomplete`, new `CommandPalette` → cmdk.
- `Accordion`, `Tab`+`Tabs`+`TabList`+`TabPanel` → `@radix-ui/react-accordion`
  / `react-tabs`.
- `Drawer` (was a stub) → vaul with full open/onClose/side API.
- `Toaster` + `toast()` → sonner.
- `ScrollArea` (in `_shared/`) → `@radix-ui/react-scroll-area`.
- New components: `CommandPalette`, `RadioGroup`, `Tabs`, `TabList`,
  `TabPanel`.
- New shared utility: `cn()` now uses `clsx + tailwind-merge` (replaces
  19 local copies).
- New `ai-manifest.json` at the repo root — machine-readable mapping
  `<primitive> → { role, engine, contract }` for AI tools.
- New `playground/` workspace with Storybook 8 for local verification.
- New `figma-plugin/README.md` documenting the Radix mapping.
- New `ARCHITECTURE.md` documenting the isolation contract.

### Changed

- `components/index.ts` now re-exports **all 57 primitives** (was only
  `Button`).
- `src/index.ts` re-exports the full components barrel.
- `package.json` exports a new `"./manifest"` subpath for
  `ai-manifest.json`.
- Card `lg` padding fix: `p-3` → `p-12` (Figma spec).
- Several primitives had local `cn()` declarations unified to import
  from `_shared`.
- Contract colors hardened: `Checkbox.contract.json`,
  `Avatar.contract.json`, `RadioButton.contract.json` had `style.bg`
  rules but missing `bg-[var(...)]` Tailwind classes — fixed.

### Architecture

- **Isolation contract.** No public file may `import '@radix-ui/...'`,
  `'cmdk'`, `'vaul'`, `'sonner'`, `'@floating-ui/...'` or
  `'class-variance-authority'`. ESLint enforces this; the only override
  is for `components/primitives/_internal/**`.
- **Source-first stays.** No build step changes; consumers still import
  TypeScript directly.

## [0.3.0] — 2026-02-26

### Added
- 5 new primitives: Select, RangeSlider, Rating, Drawer, FileUpload (spec, contracts, templates, components)
- 5 new hooks: useDebounce, useLocalStorage, useMediaQuery, useScrollLock, useIntersectionObserver
- Figma plugin builders for Select, RangeSlider, Rating, Drawer, FileUpload
- New semantic tokens: color_brand_subtle, color_success_subtle, color_danger_subtle

## [0.2.0] — 2026-02-26

### Added
- Z-index design tokens in core spec and tokens.css (header:30, popover:40, modal:50, tooltip:60, toast:70)
- TypeScript declaration files (.d.ts) generation in build pipeline
- Contract regeneration now preserves `generatorStrategy`, `manualImplementation`, `template`, `enhancements`
- Release script with auto-versioning and changelog generation (`npm run release`)
- Extended pipeline validation (z-index, preserve/template, barrel exports)

### Fixed
- Z-index tokens were missing from core package — exported projects had broken header/popover layering
- `build-dist.ts` now generates .d.ts files — consumers get full TypeScript autocomplete
- `spec-to-contracts.ts` no longer overwrites manually set metadata fields

## [0.1.0] — 2026-02-25

### Added
- 50 primitive components (Button, Input, Dropdown, Card, Table, Badge, etc.)
- Design token pipeline: ai-ds-spec.json → tokens.css + Tailwind config
- 48 component contracts (JSON-driven variant rules)
- SVG icon pack with React component wrappers
- Tailwind CSS configuration (token-driven, responsive breakpoints)
- React hooks: useBreakpoint, useClickOutside, useFocusTrap, etc.
- Layout system and behavior modules
- Figma plugin for design sync
- Cursor rules (5 contracts for AI-assisted development)
- Storybook stories for all primitives
- Light/dark theme support via data-theme attribute

### Architecture
- Package exports map for clean `@ai-ds/core/components/Button` imports
- Source-first distribution (TypeScript source, processed by consumer's Vite)
- Compatible with npm workspaces (monorepo) and standalone (npm pack)

