export const LOCALE = 'ru-RU';

export const STEPS = [
  { n: 1, title: 'Анализ', hint: 'Вставьте URL и запустите анализ' },
  { n: 2, title: 'Стиль рендера', hint: 'Один сюжет — три стилизации (A/B/C) на белом фоне' },
  { n: 3, title: 'Генерация', hint: 'Сгенерировать иконку через AI (fal)' },
  { n: 4, title: 'Публикация', hint: 'Добавить в каталог иконок' },
] as const;

export const HOW_TO_USE = {
  summary: 'Как пользоваться',
  steps: [
    'Запустите в терминале: cd modules/synaptik-icon-builder/ui && npm run dev. Откройте http://127.0.0.1:3740 (API на 3742 поднимается автоматически).',
    'Чтобы продолжить старый анализ — в блоке «Сохранённые проекты» нажмите «Открыть» у нужной строки. Повторный анализ не запускается, профиль стиля тот же.',
    'После F5 страница сама восстановит последнюю открытую сессию (если папка есть в .synaptik/sessions/).',
    '«Новый анализ» — только для нового сайта. Тот же URL уже в списке? Система предложит открыть существующую сессию.',
    '«Новая сессия принудительно» — осознанно новый профиль стиля (визуал может отличаться).',
    '«Закрыть сессию» — сбросить активную сессию в UI без удаления папки на диске; шаг 1 снова доступен.',
    'Перед «Новый анализ» выберите стиль набора (glass, isometric, soft3d, shield, flat, outline) — он один для всех иконок сессии.',
    '«Обновить стилевой контракт» — без полного анализа: icon-bible + при необходимости метафоры A/B/C.',
    'Карта блоков — где на сайте нужны иконки. Другая страница того же сайта — блок «Добавить страницу»: кнопка + для второй и следующих URL (тот же домен), без смены стиля сессии. Карточка: метафора → «Сгенерировать» → «Опубликовать».',
    'Пустой список проектов? Проверьте, что dev-сервер запущен, и что в .synaptik/sessions/ есть папки после хотя бы одного анализа. Нажмите «Обновить список».',
  ],
} as const;

/** API JSON messages (server + stable error codes). */
export const apiMessages = {
  urlRequired: 'Укажите URL сайта.',
  iconSetStyleRequired: 'Укажите стиль набора иконок (iconSetStyleId).',
  sessionExists: 'Анализ для этого URL уже существует.',
  sessionExistsHint:
    'Откройте существующую сессию, чтобы сохранить тот же профиль стиля, или отправьте forceNew: true для нового анализа.',
  analysisComplete:
    'Анализ завершён. Выберите концепцию для каждой карточки, затем «Сгенерировать» и «Опубликовать».',
  styleDnaNotFound: 'Профиль стиля не найден. Сначала запустите анализ.',
  noRenderYet: 'Иконка ещё не сгенерирована. Нажмите «Сгенерировать».',
  noPublishedIcon: 'Иконка ещё не опубликована в каталоге.',
  extendPageDone: (blocks: number, cards: number) =>
    `Страница добавлена: ${blocks} блок(ов), ${cards} новых карточек. Стиль сессии не изменён.`,
  approveRequired: 'Для публикации нужно подтверждение (approve: true).',
  published: (slug: string) =>
    `Опубликовано. В боковой панели каталога: Generated Icons → ${slug}`,
  publishReadyDone: (n: number) =>
    n > 0
      ? `Опубликовано в каталог: ${n} иконок. Папка generated-icons обновлена.`
      : 'Нет готовых иконок для публикации (нужен рендер без QA-fail и выбранная метафора).',
  deleteSessionConfirmRequired: 'Для удаления передайте confirm: true.',
  sessionDeleted:
    'Сессия удалена с диска (.synaptik). Папки generated-icons не затронуты.',
  internalError: 'Внутренняя ошибка сервера.',
  invalidJsonBody: 'Неверное тело запроса (ожидается JSON).',
} as const;

export type ApiErrorCode =
  | 'URL_REQUIRED'
  | 'SESSION_EXISTS'
  | 'STYLE_DNA_NOT_FOUND'
  | 'NO_RENDER'
  | 'APPROVE_REQUIRED'
  | 'INTERNAL';

const API_ERROR_PATTERNS: Array<{ re: RegExp; ru: string | ((m: RegExpMatchArray) => string) }> = [
  { re: /^url required$/i, ru: apiMessages.urlRequired },
  {
    re: /^Analysis for this URL already exists\.?$/i,
    ru: apiMessages.sessionExists,
  },
  { re: /^Style DNA not found$/i, ru: apiMessages.styleDnaNotFound },
  {
    re: /^No render yet\. Click Preview render first\.?$/i,
    ru: apiMessages.noRenderYet,
  },
  { re: /^approve: true required$/i, ru: apiMessages.approveRequired },
  { re: /^Internal Server Error$/i, ru: apiMessages.internalError },
  {
    re: /^Session "([^"]+)" has no Style DNA\. Run analysis first\.?$/i,
    ru: (m) => `Сессия «${m[1]}»: нет профиля стиля. Сначала запустите анализ.`,
  },
  {
    re: /^No concept selected for card "([^"]+)"\. Run: synaptik select-concept$/i,
    ru: (m) => `Для карточки «${m[1]}» не выбрана концепция. Выберите A, B или C.`,
  },
  {
    re: /^No selections\.json\. Run: synaptik select-concept$/i,
    ru: 'Нет выбранных концепций. Выберите концепцию для карточки.',
  },
  {
    re: /^No render for card "([^"]+)"\. Run: synaptik render --card \1$/i,
    ru: (m) => `Для «${m[1]}» нет сгенерированной иконки. Нажмите «Сгенерировать».`,
  },
  {
    re: /^Unknown card: (.+)$/i,
    ru: (m) => `Неизвестная карточка: ${m[1]}`,
  },
  {
    re: /^Render exists for (.+)\. Use --overwrite$/i,
    ru: (m) => `Иконка для «${m[1]}» уже есть. Нажмите «Сгенерировать» ещё раз для перезаписи.`,
  },
  {
    re: /^Icon for card "([^"]+)" failed quality checks/i,
    ru: (m) =>
      `Иконка «${m[1]}» не прошла проверку качества. Нажмите «Сгенерировать» ещё раз.`,
  },
  {
    re: /^URL must be the same site as the session/i,
    ru: 'URL должен быть на том же сайте, что и исходный анализ (тот же домен).',
  },
  {
    re: /^Style DNA missing/i,
    ru: 'Нет профиля стиля. Сначала выполните полный анализ сайта.',
  },
  {
    re: /^icon-style-bible\.json missing/i,
    ru: 'Нет стилевого контракта иконок. Запустите icon-bible или полный анализ.',
  },
  {
    re: /fal\.ai generated the image but download failed/i,
    ru: 'Иконка создана на fal.ai, но файл не скачался в Synaptik (сеть/таймаут). Нажмите «Сгенерировать» ещё раз; при VPN отключите или увеличьте SYNAPTIK_FAL_DOWNLOAD_TIMEOUT_MS в .env.',
  },
  {
    re: /fetch failed|Connect Timeout|UND_ERR_CONNECT_TIMEOUT/i,
    ru: 'Иконка на fal.ai готова, но загрузка PNG в генератор не прошла (таймаут сети). Повторите «Сгенерировать».',
  },
  { re: /^FAL_KEY is required/i, ru: 'Нужен ключ FAL_KEY в .env для генерации иконок.' },
  { re: /^OPENAI_API_KEY is required/i, ru: 'Нужен OPENAI_API_KEY в .env для анализа.' },
  { re: /^Missing file:/i, ru: (m) => `Отсутствует файл: ${m[0].replace(/^Missing file:\s*/i, '')}` },
  { re: /^No screenshots/i, ru: 'Нет скриншотов. Запустите захват страницы.' },
  { re: /^No cards to process/i, ru: 'Нет карточек для обработки.' },
  { re: /^Concept ([A-E]) not found$/i, ru: (m) => `Концепция ${m[1]} не найдена.` },
  {
    re: /MVP_DEFAULTS is not defined|Capture script is outdated/i,
    ru: 'Устаревший модуль захвата. Пересоберите Synaptik: npm run synaptik:build (или обновите @ai-ds/synaptik).',
  },
  {
    re: /Playwright Chromium is not installed|Executable doesn't exist|Failed to launch/i,
    ru: 'Не установлен браузер Playwright. Выполните: npx playwright install chromium',
  },
];

/** Map English pipeline/API errors to Russian for UI display. */
export function mapApiError(raw: string): string {
  const m = raw.trim();
  if (!m) return apiMessages.internalError;
  for (const { re, ru } of API_ERROR_PATTERNS) {
    const match = m.match(re);
    if (match) {
      return typeof ru === 'function' ? ru(match) : ru;
    }
  }
  return m;
}

export const t = {
  appTitle: 'Synaptik — генератор иконок',
  lede:
    'Готовые анализы хранятся в .synaptik/sessions/. Откройте проект из списка — профиль стиля не меняется, повторный анализ не нужен.',

  savedProjects: 'Сохранённые проекты',
  savedProjectsHint:
    'Откройте существующий анализ, чтобы продолжить работу с иконками. «Новый анализ» — только для нового сайта или когда нужен другой стиль.',
  noSessions: 'Сохранённых сессий пока нет. Запустите анализ ниже.',
  sessionsUnavailableHint:
    'Список недоступен, пока API не обновлён. Выполните npm run dev:reset в папке ui, затем нажмите «Обновить список».',
  sessionsApiOutdated:
    'API на порту 3742 устарел или занят старым процессом (нет /api/sessions). В папке modules/synaptik-icon-builder/ui выполните: npm run dev:reset',
  sessionsLoadFailed: (detail: string) =>
    `Не удалось загрузить список сессий: ${detail}. Проверьте, что npm run dev запущен (UI :3740, API :3742).`,
  apiNotJson:
    'API вернул HTML вместо JSON. Перезапустите: cd modules/synaptik-icon-builder/ui && npm run dev (нужны UI :3740 и API :3742).',
  apiHealthFailed: (detail: string | number) =>
    `API недоступен (${detail}). Запустите npm run dev:reset в папке modules/synaptik-icon-builder/ui.`,
  apiConnectionFailed:
    'Не удалось подключиться к API. Запустите в папке ui: npm run dev:reset и откройте http://127.0.0.1:3740',
  analysisBlockedApi:
    'Анализ недоступен: API не запущен или устарел. Выполните npm run dev:reset в modules/synaptik-icon-builder/ui.',
  iconSetStyleRequired:
    'Выберите стиль набора иконок (glass, isometric, soft3d, shield, flat, outline).',
  iconSetStyleLabel: 'Стиль набора иконок (для всех карточек)',
  iconSetStyleHint:
    'Фиксированный стиль рендера. Не зависит от фотореализма сайта. Можно сменить в обслуживании сессии без нового анализа.',
  iconSetStyleSessionHint:
    'Стиль применяется к сессии автоматически при выборе. Для смены метафор под новый префикс — «С перегенерацией метафор».',
  iconSetStyleChange: 'Сменить стиль набора',
  stylePendingApply: 'Стиль в списке не совпадает с сессией — применяется…',
  iconSetStyleCurrent: (label: string) => `Стиль иконок: ${label}`,
  successIconSetStyleChanged: (label: string) =>
    `Стиль набора обновлён: ${label}. Перегенерируйте метафоры при необходимости и нажмите «Сгенерировать».`,
  legacySessionStyleHint:
    'Сессия без выбранного стиля — используется изометрия по умолчанию. Нажмите «Обновить стилевой контракт».',
  urlRequired: apiMessages.urlRequired,
  apiServerError: (status: number) =>
    `Ошибка сервера API (${status}). Перезапустите npm run dev:reset. Если повторится — проверьте папки в .synaptik/sessions/.`,
  apiHealthOk: 'API Synaptik подключён — сессии и анализ доступны.',
  closeAlertAria: 'Закрыть уведомление',
  loadingSessions: 'Загрузка списка проектов…',
  loadingConcepts: 'Загрузка концепций для карточки…',
  conceptsMissing:
    'Концепции для этой карточки ещё не готовы. Обновите сессию или запустите анализ.',
  open: 'Открыть',
  closeSession: 'Закрыть сессию',
  deleteSession: 'Удалить анализ',
  deleteSessionTitle: 'Удалить сессию с диска',
  deleteSessionBody:
    'Папка .synaptik/sessions/{id} будет удалена. Иконки в generated-icons/ останутся для Storybook и продукта.',
  deleteSessionConfirm: 'Удалить',
  publishAllReady: 'Опубликовать все готовые',
  publishAllReadyHint:
    'Копирует в generated-icons/ все превью с пройденным QA и выбранной метафорой. Превью до публикации только в .synaptik/…/renders/.',
  publishReadyCount: (n: number) => `Готово к публикации: ${n}`,
  confirmPublishAllTitle: 'Опубликовать все готовые',
  confirmPublishAll:
    'Скопировать в generated-icons все превью с пройденным QA и выбранной метафорой? Storybook обновится автоматически.',
  storagePathsTitle: 'Где лежат файлы',
  storagePreviewPath: 'Превью (веб, до публикации)',
  storageCatalogPath: 'Каталог (Storybook, продукт)',
  storagePathsHint:
    'В интерфейсе «Сгенерировать» пишет PNG в сессию. «Опубликовать» копирует в generated-icons и обновляет registry.json.',
  sessionToolbarHint:
    'Сессия на диске сохраняется. Закрыть — сброс UI; новый анализ — тот же URL; принудительно — новая папка и новый STYLE_BLOCK.',
  activeSessionBadge: 'Активна',
  refreshList: 'Обновить список',
  sessionStats: (cards: number, rendered: number) =>
    `${cards} карточек · ${rendered} с превью`,

  progressAria: 'Прогресс',
  step1Title: 'Шаг 1 — Новый анализ сайта',
  urlLabel: 'URL сайта',
  urlPlaceholder: 'https://ваш-сайт.ru',
  newAnalysis: 'Новый анализ',
  forceNewSession: 'Новая сессия принудительно',
  forceNewTitle: 'Всегда создаёт новую сессию',

  stepCardsTitle: (count: number) => `Шаги 2–4 — Карточки (${count})`,
  stepCardsHint:
    'Для каждой карточки: (1) метафора A/B/C → (2) «Сгенерировать» (fal) → (3) «Опубликовать» в каталог.',
  styleBlockSummary: 'Стилевой контракт каталога (STYLE_BLOCK)',
  dnaSummary: 'Профиль стиля сайта (JSON, только справка)',
  dnaSiteOnlyHint:
    'Поле rendering в JSON — стиль сайта (часто photorealistic), не промпт иконки. Для Flux используйте STYLE_BLOCK и «Обновить стилевой контракт».',
  maintenanceTitle: 'Обслуживание сессии (без нового анализа)',
  maintenanceHint:
    'Обновляет icon-style-bible.json и при необходимости метафоры A/B/C. Затем «Сгенерировать» по карточкам.',
  maintenanceNeedsRefresh: 'Нужно обновить стиль',
  maintenanceRefreshBible: 'Обновить стилевой контракт (STYLE_BLOCK)',
  maintenanceRefreshConcepts: 'Перегенерировать метафоры A/B/C',
  fluxPromptSummary: 'Последний отправленный в Flux (после генерации)',
  fluxPromptMissing: 'Промпт ещё не сохранён. Нажмите «Сгенерировать».',
  duplicatePreviewWarning:
    'У нескольких карточек один и тот же URL — возможна коллизия папки рендера. Нажмите «Сгенерировать» заново.',
  badgePickMetaphor: 'Выберите метафору',
  noCards: 'Карточки не найдены. Попробуйте другой URL или CLI со скриншотами.',
  blockHint: 'Контекст блока — иконки ниже относятся к карточкам этого раздела.',
  blockPageBadge: (path: string) => `Страница ${path}`,
  blockPageTitle: (title: string, url: string) => `${title} · ${url}`,
  blockStats: (total: number, preview: number, published: number, outdated: number) =>
    `${total} иконок · ${preview} с превью · ${published} в каталоге` +
    (outdated > 0 ? ` · ${outdated} обновить` : ''),

  blocksMapTitle: 'Карта блоков и мест под иконки',
  blocksMapHint:
    'Все секции сайта, где нужны иконки: блок (раздел страницы) и карточки внутри. Поиск по названию блока, карточки или URL страницы.',
  blocksMapSearchPlaceholder: 'Поиск блока или иконки…',
  blocksMapNoMatch: 'Ничего не найдено. Сбросьте поиск или добавьте страницу.',
  blocksMapGoToBlock: 'Перейти к блоку',
  blocksMapIconSlots: (n: number) => `Мест под иконки (${n})`,
  structureAuditTitle: 'Аудит разметки страницы',
  structureAuditOk: 'Структура в порядке: блоки (h2) и карточки (подзаголовки) разделены.',
  structureAuditWarnings: 'Проблемы разметки',
  repairStructure: 'Починить разметку',
  busyRepairStructure: 'Исправление id блоков и карточек…',
  successRepairStructure:
    'Разметка обновлена: уникальные id блоков и пересборка списка карточек.',
  cardSkipLabel: 'Не генерировать',
  cardSkippedHint: 'Иконка исключена — fal и публикация недоступны.',

  extendPageTitle: 'Добавить страницу (тот же стиль)',
  extendPageHint: (base?: string) =>
    base
      ? `Захват другой страницы того же сайта (${base}). Style DNA и STYLE_BLOCK не меняются — только новые блоки и карточки.`
      : 'Захват другой страницы того же сайта без смены стиля сессии.',
  extendPageUrlPlaceholder: 'https://ваш-сайт.ru/pricing',
  extendPageSubmit: 'Найти блоки на странице',
  extendPageScannedList: 'Уже просканированные страницы:',
  extendPageAddRow: 'Добавить поле URL',
  extendPageRemoveRow: 'Убрать поле',
  extendPageDuplicateUrl: 'Эта страница уже добавлена в сессию.',
  extendPageSubmitAll: (n: number) => `Сканировать все (${n})`,
  busyExtendPageQueue: 'Сканирование страниц по очереди…',
  successExtendPageNext:
    'Страница обработана. Введите URL следующей страницы или нажмите +.',

  defaultBlockTitle: 'Раздел',

  badgePublished: 'В каталоге',
  badgeRendered: 'Сгенерировано',
  badgeQaFailed: 'Нужен повтор',
  badgePick: 'Выберите метафору',
  qaFailedHint:
    'Проверка качества не пройдена. Нажмите «Сгенерировать» снова.',
  previewAlt: (title: string) => `Сгенерированная иконка: ${title}`,
  previewVersionPrev: 'Предыдущая версия',
  previewVersionNext: 'Следующая версия',
  previewVersionCounter: (n: number, total: number) => `Версия ${n} из ${total}`,
  previewVersionActive: 'активная',
  previewVersionUseThis: 'Использовать эту версию',
  previewVersionHint:
    'Старые генерации сохраняются. Листайте ← → и нажмите «Использовать эту версию» — в каталог пойдёт выбранная.',
  previewRender: 'Сгенерировать',
  previewStaleHint:
    'Метафора изменилась — нажмите «Сгенерировать», чтобы обновить картинку.',
  previewStaleStyleHint:
    'Стиль набора изменился — нажмите «Сгенерировать», чтобы обновить картинку.',
  confirmPromptQualityTitle: 'Слабый промпт',
  confirmPromptQuality:
    'Промпт может плохо передать смысл карточки. Сначала «Проверить промпт» или перегенерируйте метафоры. Можно всё равно вызвать fal.',
  confirmGenerateAnyway: 'Сгенерировать всё равно',
  checkPrompt: 'Проверить промпт',
  promptDebugChain: 'Цепочка промпта (без генерации изображения)',
  promptDebugCardTitle: 'Карточка',
  promptDebugSemantic: 'Семантика',
  promptDebugSemanticMissing: 'нет — запустите анализ или synaptik semantic',
  promptDebugConcept: 'Метафора',
  promptDebugSubjectStyle: 'Предмет и стиль (как уходит в Flux)',
  promptDebugComposition: 'Композиция',
  promptDebugStylePreset: (id: string) => `Пресет: ${id}`,
  promptDebugFinalPrompt: 'Итоговый промпт для Flux',
  promptDebugClarity: (n: number) => `Ясность объекта: ${(n * 100).toFixed(0)}%`,
  promptDebugFluxSent: 'Последний отправленный в Flux',
  errorPromptQuality:
    'Промпт слабый: уточните метафору или перегенерируйте concepts. Можно «Проверить промпт» или принудительно сгенерировать.',
  errorPromptCheck: 'Не удалось собрать промпт. Выберите метафору A/B/C.',
  publishStorybook: '4. Опубликовать в каталог',
  republishStorybook: 'Обновить в Storybook',
  badgeNewVersion: 'Новая версия',
  successPreviewRepublish:
    'Новая иконка готова. Нажмите «Обновить в Storybook», чтобы заменить версию в каталоге.',

  galleryTitle: 'Галерея иконок',
  galleryHint:
    'Все карточки сессии в одном месте: крупный просмотр, смена метафоры A/B/C и публикация в Storybook после перегенерации.',
  galleryFilterAll: 'Все',
  galleryFilterPreview: 'С превью',
  galleryFilterOutdated: 'Нужно обновить в каталоге',
  galleryFilterQa: 'Проблемы QA',
  galleryNoMatch: 'Нет карточек по выбранному фильтру.',
  galleryOpenDetail: 'Открыть',
  galleryPlaceholder: 'Нет превью',
  detailTitle: (title: string) => `Иконка: ${title}`,
  detailClose: 'Закрыть',
  detailCatalogDraft: 'Новый черновик (ещё не в каталоге)',
  detailCatalogLive: 'Сейчас в каталоге',
  detailConceptHint: 'Сменили метафору? Нажмите «Сгенерировать», затем опубликуйте.',
  detailOpenStorybook: 'Открыть в Storybook',

  storybook: 'Каталог иконок',
  storybookEmpty:
    'В каталоге пока нет иконок. Сначала «Сгенерировать», затем «Опубликовать» хотя бы для одной карточки.',
  storybookPublished: (count: number, slug: string) =>
    `Опубликовано иконок: ${count}. В боковой панели Storybook: Generated Icons → ${slug}.`,
  openStorybook: 'Открыть каталог иконок в Storybook',
  storybookLinkLoading: 'Получение ссылки на каталог…',
  storybookOpenHintCatalog:
    'Откроется раздел Generated Icons (порт из STORYBOOK_PORT или SYNAPTIK_STORYBOOK_ORIGIN).',
  storybookOpenHintProject: (slug: string) =>
    `Откроется Generated Icons → ${slug} (все иконки проекта).`,
  sessionPublishedHint: (count: number, slug: string) =>
    `В этой сессии опубликовано: ${count}. Путь в Storybook: Generated Icons / ${slug}`,

  activeSession: (sessionId: string) =>
    `Активная сессия ${sessionId} — CLI: npx tsx modules/synaptik-icon-builder/src/cli/index.ts status --session ${sessionId}`,

  busyLoadingSession: 'Загрузка сохранённой сессии…',
  busyAnalyzing:
    'Анализ сайта (30–90 сек): захват → профиль стиля → карточки → концепции…',
  busyGenerating: (cardId: string) => `Генерация иконки для «${cardId}» (fal)…`,
  busyPublishing: 'Публикация в каталог…',
  busyPublishingAll: 'Публикация готовых иконок в каталог…',
  busyExtendPage: 'Сканирование страницы и поиск блоков…',
  busyRefreshBible: 'Обновление стилевого контракта (icon-bible)…',
  busyRefreshConcepts: 'Перегенерация метафор A/B/C…',

  successSessionClosed:
    'Сессия закрыта в интерфейсе. Папка на диске сохранена — откройте её снова из списка или запустите новый анализ.',
  successRefreshBible: 'STYLE_BLOCK обновлён. Нажмите «Сгенерировать» по карточкам.',
  successRefreshConcepts:
    'Метафоры A/B/C обновлены. Выберите вариант и нажмите «Сгенерировать».',

  successRestored: (sessionId: string) =>
    `Сессия ${sessionId} восстановлена. Продолжайте: метафора → «Сгенерировать» → «Опубликовать».`,
  successBootRestored: (sessionId: string) =>
    `Восстановлена последняя сессия ${sessionId} с диска.`,
  successAnalyzeDone:
    'Шаг 1 готов. Для каждой карточки: A/B/C → «Сгенерировать» → «Опубликовать».',
  successPreviewDone:
    'Иконка сгенерирована. Если всё ок, нажмите «Опубликовать».',
  successPublishDone: (slug: string) =>
    `Шаг 4 готов — откройте каталог в Storybook (Generated Icons → ${slug}). Обновите Storybook (F5), если он уже был открыт.`,
  successExtendPage: (blocks: number, cards: number) =>
    `Добавлено: ${blocks} блок(ов), ${cards} карточек. Для новых карточек: метафора → «Сгенерировать».`,

  errorPickConcept: 'Сначала выберите стиль рендера (A, B или C).',
  errorPreviewFirst: 'Сначала нажмите «Сгенерировать» для этой карточки.',
  errorPublishFailedQa:
    'Иконка не прошла проверку качества. Нажмите «Сгенерировать» заново, затем «Опубликовать».',
  errorPreviewLoad:
    'Не удалось загрузить изображение. Перезапустите UI (npm run dev:reset) и снова «Сгенерировать».',

  confirmOk: 'Продолжить',
  confirmCancel: 'Отмена',
  confirmForceNewTitle: 'Новая сессия',
  confirmForceNew:
    'Новый анализ создаёт новую сессию и новый профиль стиля — визуальный стиль может отличаться от прошлого запуска.',
  confirm409Title: 'Сессия уже есть',
  confirm409: (sessionId: string) =>
    `Анализ этого URL уже есть (сессия ${sessionId}). Открыть её, чтобы сохранить тот же профиль стиля?`,
  error409Hint: (sessionId: string) =>
    `Уже есть сессия: ${sessionId}. Нажмите «Открыть» в списке выше или «Новая сессия принудительно».`,
  confirmPublishTitle: 'Публикация',
  confirmPublish:
    'Публикация добавит иконку в generated-icons/ и каталог Storybook.',
  confirmRepublishTitle: 'Обновить в Storybook',
  confirmRepublish: (title: string) =>
    `Заменить иконку «${title}» в каталоге на текущую сгенерированную версию? Старый файл будет перезаписан.`,

  resumedDnaHint: (sessionId: string) =>
    `Профиль стиля для сессии ${sessionId} зафиксирован на диске — вы продолжаете без повторного анализа.`,

  formatApiError: (message: string) => `Ошибка: ${mapApiError(message)}`,
} as const;

export function formatDateRu(iso: string): string {
  try {
    return new Date(iso).toLocaleString(LOCALE);
  } catch {
    return iso;
  }
}
