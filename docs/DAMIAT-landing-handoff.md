# DAMIAT Product Landing — handoff

Краткий гайд для разработчика, продолжающего работу над логикой и интеграциями.

## Быстрый старт

```bash
cd C:\Users\user\Desktop\Project\DAMIAT\DAMIAT   # корень репозитория
npm ci
cd playground && npm ci && cd ..
npm run storybook
```

Откройте **http://localhost:6006/** → **Screens / DAMIAT Product Landing**.

Сторисы для QA:

| Story | Viewport |
|-------|----------|
| DamiatProductLanding | Desktop 1440 |
| DamiatProductLandingTablet | Tablet 768 |
| DamiatProductLandingMobile | Mobile 375 |

Consumer-приложение (Vite, без Storybook):

```bash
cd templates/damiat-consumer-app
npm ci
npm run dev
```

Откройте **http://localhost:5175/** — полный лендинг с заглушками формы и входа.

## Архитектура

Лендинг — не отдельный Next.js-проект, а **композиция блоков** в `@ai-ds/core`:

| Файл | Роль |
|------|------|
| `blocks/marketing/DamiatLandingPage/DamiatLandingPage.tsx` | Сборка всех секций |
| `blocks/marketing/damiatLandingFixtures.ts` | Тексты, props, демо-данные |
| `blocks/marketing/damiatLandingIntegrations.ts` | Заглушки API (форма, вход) |
| `blocks/marketing/DamiatCalculatorBlock/` | Калькулятор + mock/API цен |
| `blocks/_shared/blockLayout.ts` | Responsive-контракт (mobile/tablet/desktop) |

Импорт в consumer:

```tsx
import { DamiatLandingPage } from '@ai-ds/core/blocks/DamiatLandingPage';
import '@ai-ds/core/tokens';
```

## Карта секций (воронка)

| Якорь | Блок | Логика |
|-------|------|--------|
| — | Navbar + Hero + Events | UI; мероприятия — статический fixture |
| `#problem` | FeaturesBlock | Контент |
| `#calculator` | DamiatCalculatorBlock | **Mock-движок + опциональный API цен** |
| `#scenarios` | ShowcasePanelBlock | Аккордеон, локальный state |
| `#device` | WhyUsBlock | Контент |
| `#technology` | ProcessBlock | Контент |
| `#dashboard` | StatsBlock | Контент |
| `#benefits` | ChooseUsBlock | Контент |
| `#case` | DamiatCaseStudiesBlock | Swipe / carousel |
| — | DamiatVolumeBenefitBlock | Переиспользует `computeFullResult` |
| `#trust` | Trust + Partners | Контент + marquee |
| — | DamiatBridgeSection | Декор (скрыт при `prefers-reduced-motion`) |
| `#contact` | ContactHero + Footer | **onSubmit → интеграция** |

## Калькулятор: что готово / что подключать

### Готово (клиент)

- `calculatorEngine.ts` — сценарии with/without DAMIAT, profit delta, график
- `calculatorSchedule.ts` — план продаж, перераспределение по месяцам
- `calculatorCropsData.ts` — mock цены картофеля (сен → авг)
- `calculatorPriceApi.ts` — fetch прогноза с fallback на mock
- UI-предупреждение при перепродаже объёма (`scheduleValidation.salesOverflowTons`)

### Подключить в проде

1. **API цен** — задайте `VITE_DAMIAT_PRICE_API_URL` (или `priceApiUrl` в props блока). Ответ: `{ forecast: number[12], past?: number[12] }` в ₽/т.
2. **Валидация** — при необходимости блокировать submit при overflow (сейчас только warning).
3. **Мульти-генератор** — `device1: boolean`; `DEVICE_TONS_CAPACITY` считается, UI выбора N устройств нет.
4. **Backend расчёта** — опционально вынести `computeFullResult` на сервер для аудита.

## Форма и авторизация

- `damiatLandingIntegrations.ts` — `createDamiatContactSubmitHandler`, `createDamiatLoginHandler`
- `buildDamiatLandingProps()` — собирает fixtures + handlers
- Consumer: `POST /api/contact` и `POST /api/auth/login` (заглушки в `templates/damiat-consumer-app/src/api.ts`)

Замените fetch URL и добавьте реальную CRM / auth.

## Mobile QA (чеклист)

- [ ] Storybook → DamiatProductLandingMobile
- [ ] Navbar drawer, якоря `#calculator`, `#contact`
- [ ] Калькулятор: пресет 536 га / 28 т/га, табы «Сентябрь — Февраль»
- [ ] Горизонтальный swipe: summary chips, volume benefit, case studies
- [ ] Showcase: аккордеон без desktop preview
- [ ] `prefers-reduced-motion` — bridge скрыт

## TODO для следующего спринта

| Приоритет | Задача |
|-----------|--------|
| P0 | Подключить реальный API цен и CRM для формы |
| P0 | Роутинг: страницы кейсов, событий, login |
| P1 | UI выбора числа генераторов по объёму |
| P1 | CMS для мероприятий и кейсов |
| P2 | Hero-медиа (oscilloscope) на mobile |
| P2 | Scroll-hints для горизонтальных полос |

## Команды перед push

```bash
npm run lint
npm run tokens:check
npm run patterns:check
cd playground && npm run build-storybook
```

Не коммитить: `node_modules/`, `.env`, `storybook-static/`.
