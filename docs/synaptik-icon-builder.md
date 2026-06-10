# Synaptik AI Icon Builder

AI module for generating **raster** icon sets from a website URL or screenshots, with a single immutable **Style DNA** per session. Lives in the repo at `modules/synaptik-icon-builder/` — not part of the published `@ai-ds/core` npm package.

**Related docs:** [generated-icons/README.md](../generated-icons/README.md) (git policy for assets), [ARCHITECTURE.md](../ARCHITECTURE.md) (section 9).

## Prerequisites

| Variable | Required when | Description |
|----------|---------------|-------------|
| `FAL_KEY` | `render` / `regenerate` | fal.ai — `fal-ai/flux/schnell` |
| `OPENAI_API_KEY` | Vision steps (OpenAI) | Style DNA, content, concepts |
| `OPENAI_BASE_URL` | Optional | OpenRouter: `https://openrouter.ai/api/v1` |
| `SYNAPTIK_VISION_MODEL` | OpenAI | Default `google/gemini-2.0-flash-001` (cheap). Avoid `gpt-4o` for full analyze. |
| `SYNAPTIK_VISION_PROVIDER` | Optional | `openai` (default) or `anthropic` |
| `SYNAPTIK_COMBINED_ANALYZE` | Optional | `1` = one vision call for Style DNA + block/card structure |
| `ANTHROPIC_API_KEY` | Vision (Anthropic) | When provider is `anthropic` |
| `SYNAPTIK_ANTHROPIC_MODEL` | Anthropic | Default `claude-3-5-haiku-20241022` |

Copy [`.env.example`](../.env.example) to `.env` at the repo root.

### Cost tips (OpenRouter)

- Use **`google/gemini-2.0-flash-001`** or **`openai/gpt-4o-mini`**, not `gpt-4o`.
- Full analyze is typically **2–3 vision calls** (or **1** with `SYNAPTIK_COMBINED_ANALYZE=1`), plus **batched text-only concepts** (no screenshots).
- Analyze prefers **`fullpage.png`** when present (then viewport); up to 2 images per call.
- Rough target: **~$0.02–0.08** per URL analyze vs **$0.20+** with GPT-4o on every step.

## Setup

```bash
cd modules/synaptik-icon-builder && npm ci && cd ../..
cp .env.example .env
# Fill FAL_KEY and vision keys
npx playwright install chromium
```

### Variant A — one `.env` for several local repos (recommended)

Keep **secrets only** in `AICADS-PRO/.env` (gitignored). Point Synaptik at a **product workspace** without copying keys:

1. Copy [`synaptik.local.env.example`](../synaptik.local.env.example) → `synaptik.local.env` in the product repo (or use the file in AICADS-PRO root).
2. Set `SYNAPTIK_ENV_FILE` = absolute path to `AICADS-PRO/.env`.
3. Set `SYNAPTIK_WORKSPACE_ROOT` = product repo root (`synaptik.config.json`, `.synaptik/`, `outputDir`).
4. From AICADS-PRO root:

```bash
npm run synaptik:ui -- --workspace C:/path/to/your-product
```

Or only monorepo work: `npm run synaptik:ui` (uses `synaptik.local.env` + root `.env`).

Check keys (no values): http://127.0.0.1:3742/api/health → `env.fal`, `env.vision`.

Root npm scripts (from repo root):

| Script | Action |
|--------|--------|
| `npm run synaptik -- <command>` | Run CLI |
| `npm run synaptik:check` | Validate `generated-icons/registry.json` vs files (CI) |
| `npm run synaptik:build` | Compile module (`tsc`) |

## Content model: blocks and cards

| Level | Example | Asset (phase 1) |
|-------|---------|-----------------|
| **Block** | h2-level section title (e.g. «Мероприятия») | Section context only |
| **Card** | h3/h4 inside the block | **Icon** (PNG/WebP) |

- DOM capture builds an h2 → h3/h4 draft; vision refines it (DOM-first when the draft has cards).
- `ensureUniqueBlockAndCardIds` runs on every write — Cyrillic titles no longer collapse to a shared `icon` id.
- `content-structure.json` — `blocks[]` with nested `cards[]`; `content-structure.audit.json` — warnings.
- `content-cards.json` — flat list for render/UI (`blockId`, `blockTitle`, optional `skipped`).
- Legacy sessions without structure: cards grouped under virtual block `Features`.

**Render version history:** each «Сгенерировать» archives the previous PNG under `renders/<slug>/versions/<id>/`. In the UI, use ← → to browse versions and **«Использовать эту версию»** to restore one as active (what gets published).

**Repair existing sessions** (fixes duplicate block ids in UI without re-analyze):

```bash
npm run synaptik -- repair-structure --session <id>
```

UI: «Починить разметку» in the blocks map. Per-card **«Не генерировать»** sets `skipped` (no semantic/concepts/render).

## Multiple pages (same site)

After the first analyze, use **«Добавить страницу»** in the UI (step 2+):

- Enter another URL on the **same origin** as `manifest.sourceUrl`.
- Click **+** next to the URL field to add more rows; scan one row or **«Сканировать все»** for a queue.
- `extend-page` appends blocks/cards only — **Style DNA** and **icon-style-bible** stay unchanged.
- Click a scanned page in the list to fill an empty URL row.

CLI: `npm run synaptik -- extend-page --session <id> --url https://example.com/pricing`

## Changing icon set style mid-session

| Step | What happens |
|------|----------------|
| Select preset in **Обслуживание сессии** | UI applies style to the session automatically (~400 ms debounce) and refreshes `icon-style-bible.json` |
| **Проверить промпт** | Shows **Предмет и стиль** — STYLE lines immediately after SUBJECT (same order as Flux) |
| **Сгенерировать** | Required to refresh PNGs; old previews show «Стиль набора изменился…» until re-render |

**Source of truth:** `manifest.iconSetStyleId` (not a stale `styleBlock` string in the bible). Flux style is rebuilt via `assembleStyleBlockForFlux` from manifest preset + bible palette/anchor.

**If style still looks wrong:** use **«С перегенерацией метафор»** (refreshes `iconSubjectPrefix` on concepts), then **Сгенерировать**. Check `prompts/{slug}.txt` for `Icon set style preset: <id>` and `renders/.../meta.json` for matching `iconSetStyleId` / `promptHash`.

| Symptom | Likely cause |
|---------|----------------|
| PNG unchanged after style change | Preview not re-rendered (UI stale badge) |
| Prompt still shows old preset | Style not applied to session — check manifest / «Проверить промпт» |
| Similar image after re-render | Same metaphor + low seed variance — change metaphor or click **Сгенерировать** again (nonce bumps seed; style id is in seed hash) |

## Product integration (AICADS + consumer repos)

Synaptik is **not** shipped inside the `@ai-ds/core` npm tarball. Raster assets live in **your product repo**; the design system provides tokens, blocks, and a thin runtime primitive.

### Package layout

| Piece | Location |
|-------|----------|
| Design system | `@ai-ds/core` — components, tokens, SVG `./icons`, Storybook kit |
| Generator CLI | `@ai-ds/synaptik` in this monorepo (`modules/synaptik-icon-builder/`, `npm run synaptik` from root) |
| Published assets | `{outputDir}/` (default `generated-icons/`) — commit after `synaptik publish` |

### Configure output directory

Copy [`synaptik.config.example.json`](../synaptik.config.example.json) to `synaptik.config.json` in the product repo root, or set env:

| Variable | Purpose |
|----------|---------|
| `SYNAPTIK_ICONS_DIR` | Catalog root (relative to workspace or absolute) |
| `SYNAPTIK_WORKSPACE_ROOT` | Product repo root when not AICADS monorepo |
| `SYNAPTIK_PROJECT_SLUG` | Default slug hint |
| `SYNAPTIK_ICON_SET_STYLE` | Default preset for new sessions |

### After publish (per `projectSlug`)

```
{outputDir}/{projectSlug}/
  {iconSlug}/icon.png, icon.webp, meta.json
  Icons.stories.tsx      # Storybook — AUTO-GENERATED
  icons.manifest.ts      # App imports — AUTO-GENERATED
registry.json
```

**App code:**

```tsx
import { iconsBySlug } from '@/assets/generated-icons/my-product/icons.manifest';
import { GeneratedIcon } from '@ai-ds/core/components/GeneratedIcon';
import { FeaturesBlock } from '@ai-ds/core/blocks/FeaturesBlock';

<GeneratedIcon src={iconsBySlug['my-slug'].png} webpSrc={iconsBySlug['my-slug'].webp} alt="..." size={48} />

<FeaturesBlock generatedIcons={iconsBySlug} features={[{ title: '…', description: '…', iconSlug: 'my-slug' }]} />
```

### Storybook in a consumer app

```ts
import path from 'node:path';
import { createMainConfig } from '@ai-ds/core/storybook/createMainConfig.mjs';

export default createMainConfig({
  mode: 'consumer',
  storybookDir: import.meta.dirname,
  projectRoot: path.resolve(import.meta.dirname, '..'),
  generatedIconsDir: 'src/assets/generated-icons', // or absolute path
});
```

See [storybook-parity.md](./storybook-parity.md) checklist **D**.

### CI without API keys

```bash
npm run synaptik:check
# or: npx synaptik check
```

Validates `registry.json`, PNG/WebP/meta, `Icons.stories.tsx`, and `icons.manifest.ts`.

### SVG vs raster

- **SVG** (`@ai-ds/core/icons`) — UI chrome, arrows, status.
- **Synaptik raster** — marketing feature illustrations on white canvas. Do not mix in buttons/inputs.

## Pipeline overview

```text
Card title (+ description)
  → semantic interpret (English visualObject + iconType)
  → concepts (3–5 concrete visualObject variants A/B/C)
  → select-concept
  → build-prompt (SUBJECT → STYLE → COMPOSITION; subject first in Flux)
  → render (Flux schnell, prompt quality gate)
  → publish --approve

URL or screenshots
  → capture → analyze-style + analyze-content (or SYNAPTIK_COMBINED_ANALYZE=1)
  → icon-style-bible.json (fixed icon-set preset + vision palette only)
  → semantic → concepts → …
```

MVP limits (defaults): **12 blocks**, **8 cards per block**, **24 DOM blocks** in capture; **3 metaphors (A/B/C) per card** (max 5). Override via `--max-blocks` / `--max-cards-per-block`. **One `styleBlock` per session**; white `#FFFFFF` canvas; `fal-ai/flux/schnell`. **Card titles are never sent to Flux** — only English `visualObject` from semantic + concepts.

## Quick flow (CLI)

```bash
npm run synaptik -- run --url https://example.com --icon-style isometric

npm run synaptik -- select-concept --session <id> --card <cardId> --concept B
npm run synaptik -- render-all --session <id>
npm run synaptik -- publish --session <id> --card <cardId> --approve
```

### Auto render (after selections exist)

```bash
npm run synaptik -- run --url https://example.com --icon-style isometric --auto --publish --approve
```

### Step by step

```bash
npm run synaptik -- init --url https://example.com
npm run synaptik -- capture --session <id> --url https://example.com
npm run synaptik -- analyze-style --session <id>
npm run synaptik -- analyze-content --session <id> --max-blocks 6 --max-cards-per-block 6
npm run synaptik -- semantic --session <id>
npm run synaptik -- concepts --session <id>
# … select, render, publish
```

## CLI reference

| Command | Purpose |
|---------|---------|
| `analyze-content` | `content-structure.json` + flat `content-cards.json` |
| `semantic` | `semantic/{cardSlug}.json` — English `visualObject`, `iconType`, `visualFocus` |
| `concepts` | Batched text-only concepts (uses semantic); stores `visualObject` per A/B/C |
| `audit-prompt` | Dry-run prompt + `PromptAuditReport` / score (no FAL) |
| `run` | Full pipeline; **`--icon-style`** required (`glass` \| `isometric` \| `soft3d` \| `shield` \| `flat` \| `outline`) |
| `icon-bible` | Regenerate `icon-style-bible.json` from preset; optional `--icon-style` |
| `check --fix-stories` | Restore published icons from `.synaptik` sessions into `generated-icons/`, sync `registry.json`, regenerate `Icons.stories.tsx` |
| `publish-ready --approve` | Publish all QA-ok renders with concept selection (skips `skipped` cards) |
| `reconcile --session <id>` | Fix `meta.cardId` on renders when card ids changed (match by `sourceCard` title) |
| `delete-session --confirm` | Delete `.synaptik/sessions/<id>/` only; catalog untouched |

**Storybook (playground):** from repo root `npm run storybook` → http://127.0.0.1:6006. Index: **Generated Icons → Synaptik guide**. If Storybook does not start or `/index.json` fails, run **`npm run storybook:reset`** (clears cache, removes broken `generated-icons/*`, fixes stories, frees port 6006). After clone/resume: **`npm run storybook:sync`** (`fix-stories` + static build).

(See earlier sections for `init`, `capture`, `render`, `publish`, etc.)

## Session artifacts

| File / folder | Step |
|---------------|------|
| `capture-report.json` | capture (`domStructure` draft) |
| `manifest.json` | includes `iconSetStyleId` (session icon preset) |
| `style-dna.json` | site reference only (`siteVisualStyle`); not copied to Flux |
| `icon-style-bible.json` | **`styleBlock`** from preset library + brand palette; `iconSetStyleId` |
| `content-structure.json` | analyze-content |
| `content-cards.json` | flattened cards for icons |
| `semantic/*.json` | per-card semantic interpret |
| `prompts/{slug}.txt` | last Flux prompt (subject-first sections) |
| `prompts/{slug}.debug.json` | sections, audit, score |
| `renders/{iconSlug}/` | white-bg PNG, 65–85% subject fill, `falSeed`, `failedQa` |

## Where files live (preview vs catalog)

| What you see | On disk | In git |
|--------------|---------|--------|
| **Preview** in UI after «Сгенерировать» | `.synaptik/sessions/{sessionId}/renders/{iconSlug}/icon.png` | No (`.synaptik/` is local) |
| **Published** catalog / Storybook | `generated-icons/{projectSlug}/{iconSlug}/` (+ `registry.json`, `Icons.stories.tsx`, `icons.manifest.ts`) | Yes (recommended) |

- Preview URLs: `GET /api/session/:id/preview/:cardId/icon.png` → session `renders/`.
- Published URLs: `GET /api/session/:id/published/:cardId/icon.png` → `generated-icons/` (only after «Опубликовать»).
- Output root: `synaptik.config.json` → `outputDir` or env `SYNAPTIK_ICONS_DIR` (default `generated-icons/`).
- UI panel **«Где лежат файлы»** and `GET /api/storage-paths?sessionId=` show relative paths.
- **«Опубликовать все готовые»** / `publish-ready --approve` copies all QA-ok renders with a selected metaphor into the catalog (one Storybook regen at the end).
- **«Удалить анализ»** / `delete-session --confirm` removes only `.synaptik/sessions/{id}/`; **`generated-icons/` is not deleted**.
- After structure changes: `reconcile --session <id>` or automatic reconcile on `writeContentFromBlocks`; publish uses `iconSlug = slugify(cardId)` and dedupes registry by `cardId`.

## Icon output (white + framing)

- Prompts: **SUBJECT block** (concrete `visualObject`) → **STYLE block** (bible / preset) → **COMPOSITION block** (white canvas rules). Render blocked if `objectClarity < SYNAPTIK_PROMPT_MIN_CLARITY` (default 0.6); override with `SYNAPTIK_PROMPT_FORCE=1` or API `{ force: true }`.
- Flux [`fal-ai/flux/schnell`](https://fal.ai/models/fal-ai/flux/schnell/api): `output_format: png`, `acceleration: none`, deterministic `seed`; **no `negative_prompt`** (FLUX ignores it — use positive phrasing in the prompt).
- Optional env: `SYNAPTIK_FAL_STEPS` (1–12, default 4), `SYNAPTIK_FAL_GUIDANCE` (default 3.5).
- Post-process: safe bbox padding + center on white (`icon-composition.ts`).
- QA: white border ring, crop margins, grain heuristic; up to **3** render attempts; publish blocked when `failedQa: true` in `meta.json`.
- Subject fill **65–85%** of square.

## Where quality issues originate

| Symptom | Typical stage |
|---------|----------------|
| Grain / JPEG artifacts | Flux default JPEG (now PNG); border grain → QA `grainy_border` |
| Text / labels in image | Concepts or prompt leaking card copy; Flux renders text well — keep prompts in English without quoted titles |
| Non-white background | Style DNA lighting/palette vs icon rules; bible + QA `non_white_edges` |
| Cropped subject | Model composition or aggressive trim; safe bbox in `icon-composition`, QA `cropped_edges` |
| Wrong object (agro diorama vs metaphor) | Legacy double-sanitize dropped subject — re-run `semantic` + `concepts`, use «Проверить промпт» in UI |
| Inconsistent style | Missing or stale bible; change preset in UI (auto-apply) or `icon-bible --force` + re-render |
| Style change has no effect | Only Select changed without apply (legacy); or preview not regenerated — see **Changing icon set style** |

### Upgrading an existing session

```bash
npm run synaptik -- semantic --session <id> --force
npm run synaptik -- icon-bible --session <id> --force
npm run synaptik -- concepts --session <id>
npm run synaptik -- audit-prompt --session <id> --card <cardId>
# Re-preview each card in UI or: render-all --overwrite
```

## Phase 2 (not implemented yet)

- **Block images** — hero visual per section (`render-block`, Storybook `blocks/` subtree)
- Same white background and composition rules as icons

## Web UI

Built only on **@ai-ds/core** (tokens + Tailwind preset + primitives). No custom colour CSS. See [internal-ui.md](./internal-ui.md).

```bash
cd modules/synaptik-icon-builder/ui && npm ci && npm run dev
npm run lint          # in ui/ — AICADS token + import rules
# or from repo root:
npm run synaptik:ui:lint
```

| URL | Role |
|-----|------|
| http://localhost:3740 | React UI — cards grouped by block |
| http://127.0.0.1:3742 | Express API |

### Session persistence and multi-project workflow

Each analysis is stored under `.synaptik/sessions/{sessionId}/` on disk:

| File / folder | Purpose |
|---------------|---------|
| `manifest.json` | `sourceUrl`, `projectSlug`, timestamps |
| `style-dna.json` | Immutable style for this session (do not re-analyze to keep it) |
| `icon-style-bible.json` | Icon-only visual contract (styleAnchor, palette, composition) |
| `content-structure.json`, `content-cards.json` | Block hierarchy and cards |
| `selections.json` | Chosen concept per card |
| `concepts/` | Per card: `iconSubject` + A/B/C `renderStyle` variants |
| `renders/` | Preview PNGs and publish metadata |

The UI keeps the active session id in `localStorage` (`synaptik.activeSessionId`). After refresh (F5), HMR, or dev-server restart, it restores the last session via `GET /api/session/:id/state` — **no** second `POST /api/run`.

- **Saved projects** — sidebar lists all sessions (`GET /api/sessions`); **Open** resumes without vision cost.
- **New analysis** — runs the full pipeline (`POST /api/run`). If the same URL already has a session, the API returns **409** with `existingSessionId`; the UI offers to open that session instead.
- **Force new session** — sends `forceNew: true` after confirm; creates a new session and new Style DNA (style may differ).

CLI equivalent to resume without re-running analyze:

```bash
npm run synaptik -- status --session <id>
```

Switch projects in the UI with **Open** on another row; the active session id updates in `localStorage`.

### Интерфейс (RU)

Веб-UI на русском: http://localhost:3740. Краткая инструкция также в блоке **«Как пользоваться»** на странице.

1. Запуск: `cd modules/synaptik-icon-builder/ui && npm run dev` (React :3740, API :3742).
2. **Сохранённые проекты** (вверху) — список анализов с диска. **Открыть** — продолжить без повторного analyze и без смены Style DNA.
3. **F5** — автоматически поднимается последняя открытая сессия (`localStorage`: `synaptik.activeSessionId`).
4. **Новый анализ** — полный пайплайн; для того же URL API вернёт 409 и предложит открыть существующую сессию.
5. **Новая сессия принудительно** — новый Style DNA (стиль может отличаться), только с подтверждением.
6. На карточке: метафора A/B/C → **Предпросмотр** → **Опубликовать** → иконка в Storybook.
7. **Карта блоков** — где на сайте нужны иконки (блок → карточки), поиск, переход к секции.
8. **Добавить страницу** — другой URL того же сайта без нового анализа стиля (`extend-page` в UI или CLI).
9. **Галерея иконок** — сетка всех карточек, крупный просмотр; после перегенерации — **Обновить в Storybook**.
10. Пустой список — проверьте dev-сервер и папки в `.synaptik/sessions/*/ ` (`manifest.json` + `style-dna.json`), нажмите **Обновить список**.

```bash
npm run synaptik -- extend-page --session <id> --url https://example.com/pricing
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `page.evaluate: ReferenceError: MVP_DEFAULTS is not defined` | Outdated capture script. From AICADS-PRO root: `npm run synaptik:build`, restart UI. In a consumer app: reinstall `@ai-ds/synaptik` from the same tag/commit. |
| `Playwright Chromium is not installed` / `Executable doesn't exist` | `npx playwright install chromium` (from repo root or product root). |
| Sessions / `generated-icons` appear under `modules/synaptik-icon-builder/ui/` | Set `SYNAPTIK_WORKSPACE_ROOT` to your **product repo root** (with `synaptik.config.json`) before `npm run dev` in the UI. See [PACKAGING.md](../modules/synaptik-icon-builder/PACKAGING.md). |
| `page.goto` timeout (60s) | Heavy sites may never reach `networkidle`; retry or use screenshot-only capture (`--screenshots`). |
| `.env` keys missing in UI | Use **variant A**: `SYNAPTIK_ENV_FILE` → shared `AICADS-PRO/.env`, `npm run synaptik:ui -- --workspace <product>`. Health: `/api/health` shows `env.fal` / `env.vision`. |

Optional Playwright smoke test (local): `SYNAPTIK_CAPTURE_SMOKE=1 npm test` in `modules/synaptik-icon-builder`.

## Tests

```bash
cd modules/synaptik-icon-builder && npm test
```

## What Synaptik does not touch

- `components/icons/index.tsx` — SVG React barrel
- `ai-manifest.json` — unless you wire raster icons manually
