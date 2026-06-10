# Internal module UIs (AICADS)

Any in-repo web UI under `modules/**/ui/` (including **Synaptik Icon Builder**) must be built as an **AICADS consumer**, not as a one-off stylesheet.

## Required stack

1. **Tokens** — in `index.css` (before `@tailwind`) and/or entry:
   ```css
   @import '../../../../config/css-variables/tokens.css';
   ```
   ```tsx
   import '@ai-ds/core/tokens';
   ```
2. **Tailwind** — use the Storybook consumer factory (full `content` scan from core):
   ```js
   // tailwind.config.cjs
   const createStorybookTailwindConfig = require('@ai-ds/core/storybook/tailwind').default;
   module.exports = createStorybookTailwindConfig(__dirname);
   ```
3. **Theme** — `SynaptikTheme` (or equivalent) sets `data-theme="light"` and `body` via `--color-bg-base` / `--font-family-base`.
4. **Components** — use primitives from `@ai-ds/core/components/<Name>` or the barrel `@ai-ds/core/components`. Reference roles in [`ai-manifest.json`](../ai-manifest.json) and contracts in `contracts/components/`.

## Forbidden

| Do not | Use instead |
|--------|-------------|
| Hex / `rgb()` colours in UI code | `var(--color-*)` via Tailwind `text-[var(--color-text-primary)]` etc. |
| Custom `styles.css` with colours, buttons, banners | `Button`, `Card`, `Alert`, `Input`, … |
| `@radix-ui/*`, `cmdk`, `vaul`, `sonner`, `cva` in module UI | Matching AICADS primitive |
| Marketing **blocks** for tool screens | Primitives + layout utilities (`layout.ts` token classes) |

## Layout

- Page spacing: token utilities only (see `modules/synaptik-icon-builder/ui/src/layout.ts`).
- Optional section rhythm: [`@ai-ds/core/recipes`](../recipes/index.ts) (`resolveRecipe`, `getRecipeTailwind`).

## Lint before merge

From the UI package:

```bash
cd modules/synaptik-icon-builder/ui && npm run lint
```

From repo root:

```bash
npm run synaptik:ui:lint
```

Enforces:

- `@ai-ds/core/eslint-config` — no direct behavior-engine imports
- `no-hardcoded-tokens` — no raw px/colours in `modules/**/ui/src/**`

## Synaptik: язык интерфейса и контент

- **Оболочка UI и API** (`modules/synaptik-icon-builder/ui/src/i18n/ru.ts`) — кнопки, шаги, ошибки API, диалоги подтверждения (Modal) на русском.
- **Карточки и концепции** с vision остаются на **языке анализируемого сайта**; это не переводится в UI.
- **Storybook** — в боковой панели раздел может называться `Generated Icons` (англ. slug stories); в UI подсказки говорят «каталог иконок».

## Synaptik: качество иконок (рендер)

Пайплайн требует **белый фон #FFFFFF** и **без текста/надписей** на изображении:

- **Библиотека стилей набора** — фиксированные preset (`glass`, `isometric`, `soft3d`, `shield`, `flat`, `outline`) в [`icon-set-styles/index.ts`](../modules/synaptik-icon-builder/src/icon-set-styles/index.ts). Выбор **обязателен** перед «Новый анализ»; один preset на всю сессию. Смена в «Обслуживание сессии» без повторного analyze: `POST /api/session/:id/icon-set-style`.
- **STYLE_BLOCK** — собирается **только из preset** + палитра бренда (vision не задаёт renderMode). `style-dna.json` / `siteVisualStyle` — справка о сайте, **не** в Flux.
- **Концепции A/B/C** — три **разные метафоры** (`iconSubject` на вариант), один стиль сессии; [`concepts.ts`](../modules/synaptik-icon-builder/src/pipeline/concepts.ts).
- **Промпт Flux** — `styleBlock` + `Icon subject:` + `FLUX_MANDATORY_TAIL`; [`build-prompt.ts`](../modules/synaptik-icon-builder/src/pipeline/build-prompt.ts). Без `negative_prompt` (FLUX не поддерживает).
- **fal** — PNG, `acceleration: none`, seed на сессию/карточку/концепцию; [`fal-flux.ts`](../modules/synaptik-icon-builder/src/adapters/fal-flux.ts).
- **Пост-обработка** — безопасный crop с отступом; [`icon-composition.ts`](../modules/synaptik-icon-builder/src/adapters/icon-composition.ts).
- **QA** — до 3 попыток рендера; при `failedQa` кнопка «Опубликовать» отключена, бейдж «Нужен повтор»; [`icon-qa.ts`](../modules/synaptik-icon-builder/src/adapters/icon-qa.ts), [`render.ts`](../modules/synaptik-icon-builder/src/pipeline/render.ts).

Уже сгенерированные PNG не меняются — нажмите «Предпросмотр» снова. Старые сессии без bible: перезапустите анализ с `--force` или откройте новую сессию.

## Synaptik: карта блоков и доп. страница

- **Карта блоков** (`BlocksMapPanel`) — все секции сайта с описанием, страницей-источником, списком карточек (мест под иконки), прогрессом и поиском. Кнопка «Перейти к блоку» скроллит к `#block-{id}` в карточном workflow.
- **Заголовки блоков** в `CardsWorkflow` — название секции, описание, бейдж страницы (`/path`), счётчик иконок.
- **Добавить страницу** (`ExtendPagePanel`) — `POST /api/session/:id/extend-page` с `{ url }`. Тот же домен, что `manifest.sourceUrl`; **не** перезаписывает `style-dna.json` / `icon-style-bible.json`. Новые блоки в `content-structure.json`, id с префиксом `pageSlug-`, концепции только для новых карточек.
- CLI: `synaptik extend-page --session <id> --url <pageUrl>`.

## Synaptik: галерея иконок и обновление Storybook

После шага 2 (карточки) доступна панель **«Галерея иконок»** (`IconGalleryPanel`):

- Сетка всех карточек сессии, фильтры: все / с превью / нужно обновить в каталоге / проблемы QA.
- Клик по плитке — модальное окно с крупным превью, выбором метафоры A/B/C, кнопками «Предпросмотр», «Опубликовать» / **«Обновить в Storybook»**, «Открыть в Storybook».

**Перегенерация:** выберите другую метафору → «Предпросмотр». Если иконка уже была в каталоге, появится бейдж «Новая версия» и кнопка «Обновить в Storybook» (тот же `POST /api/publish`, файлы в `generated-icons/` перезаписываются).

**Статус каталога:** API `GET /api/session/:id/state` отдаёт `iconStatus[cardId].catalogStatus` (`none` | `current` | `outdated`). Сравнение — `conceptId` и `promptHash` черновика vs опубликованного `meta.json`. Опубликованный PNG для сравнения: `GET /api/session/:id/published/:cardId/icon.png`.

После F5 сессия восстанавливает превью и флаг «нужно обновить», если черновик новее каталога (исправлен hydrate в `useSynaptikSession`).

## Synaptik: сессия в UI (закрыть / новый анализ / стиль без analyze)

- **Закрыть сессию** (`SessionToolbar`, список проектов) — сбрасывает активную сессию в UI (`localStorage` `synaptik.activeSessionId`), **не удаляет** папку в `.synaptik/sessions/`. Снова откройте из списка или запустите анализ.
- **Новый анализ** / **Новая сессия принудительно** — всегда доступны в toolbar и в свёрнутом «Шаг 1» (аккордеон), даже при `flowStep >= 2`.
- **Обслуживание сессии** — `POST /api/session/:id/refresh-icon-style` с `{ refreshConcepts?: boolean }`: `icon-bible --force`, опционально перегенерация метафор. Эквивалент CLI без полного `POST /api/run`.
- **Профиль стиля сайта (JSON)** в UI — только справка о сайте (`siteVisualStyle`); фотореализм с сайта **не** копируется в иконки. Стиль иконок = выбранный preset в toolbar / обслуживании.
- **CLI:** `synaptik run --url … --icon-style isometric` (обязательно для `run`).
- **Проверить промпт** (без FAL) — `GET /api/session/:id/prompt-preview/:cardId?concept=A`: цепочка карточка → семантика → метафора → итоговый промпт + audit/score.
- **Последний Flux-промпт** — `GET /api/session/:id/prompt/:cardId` (файл `prompts/{slug}.txt` после «Предпросмотр»).
- **Низкое качество промпта** — `POST /api/render-preview` может вернуть 422 `PROMPT_QUALITY_LOW`; перегенерируйте `semantic` + `concepts` или уточните метафору.
- **Карта блоков / карточки** — аккордеоны по блокам (по умолчанию свёрнуты; раскрыт первый или блок с «нужно обновить»).
- **Одинаковые превью** — предупреждение в workflow; уникальные папки рендера: `resolveRenderDirName` в [`render-dir.ts`](../modules/synaptik-icon-builder/src/utils/render-dir.ts).

## Troubleshooting (Synaptik)

| Symptom | Fix |
|---------|-----|
| Serif font, grey system buttons, no cards | Tailwind не собран в dev: остановите старый процесс на :3740, заново `npm run dev` из `ui/`. В Network должен быть CSS ~140KB (не пустой). `index.css` импортирует `@ai-ds/core/tokens` и `@tailwind`. |
| `Unexpected token '<', "<!DOCTYPE"` | API on :3742 is wrong or old. Stop process on 3742, run `npm run dev` (starts server + Vite). Check banner: API health. |
| Empty session list | `GET /api/sessions` must return JSON. Preflight script warns if port 3742 is busy. |
| Storybook `NoMetaError` / `web-hosting.../Icons.stories.tsx` | Orphan folder after deleting published icons. From repo root: `npm run synaptik:fix-stories`, then restart Storybook (`cd playground && npm run storybook`). `storybook-prep` removes orphan `generated-icons/*` dirs not in `registry.json`. |

```bash
cd modules/synaptik-icon-builder/ui
npm install
npm run dev    # not vite alone — needs API on 3742
```

## PR checklist

- [ ] `@ai-ds/core/tokens` imported in `main.tsx`
- [ ] No deleted/added monolithic CSS with hardcoded palette
- [ ] All interactive controls use AICADS primitives
- [ ] `npm run lint` passes in the UI package
- [ ] Visual check at http://localhost:3740 (Synaptik)

## References

- [ARCHITECTURE.md](../ARCHITECTURE.md) — three-layer model
- [getting-started.md](./getting-started.md) — consumer setup
- [.cursor/rules/aicads-imports.mdc](../.cursor/rules/aicads-imports.mdc)
- [.cursor/rules/aicads-internal-ui.mdc](../.cursor/rules/aicads-internal-ui.mdc)
