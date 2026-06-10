
# DAMIAT Landing — структура страницы

Композиция маркетингового лендинга DAMIAT (калькулятор, сценарии, прибор, платформа, кейс, контакт). Storybook: **Screens/DAMIAT Product Landing**.

## Верхний уровень

```
DamiatLandingPage
├── NavbarBlock
└── DamiatLandingScrollBody
```

## Порядок секций

1. `MarketingAboveFold` + `HeroBlock` (+ опционально `EventsBlock`)
2. Калькулятор, сценарии, прибор, платформа, кейс, trust, partners…
3. **`DamiatBridgeSection`** — экран DAMIAT (in-flow мост, без scroll-loop)
4. `BrandPhotoHeroSection` contact + `FooterBlock` («Запросите расчёт и демо платформы»)

## Профиль анимации (`motionProfile`)

| Профиль | Storybook default | Parallax | ScrollDepthReveal |
|---------|-------------------|----------|-------------------|
| `lean` | Product Landing | выкл. (`factor=0`) | **нет** reveal (статичные секции); `content-visibility: auto` |
| `full` | Full motion story | hero + photo bands | 3D depth на всех обёртках |

Проп: `motionProfile?: 'lean' | 'full'` на [`DamiatLandingPage`](../../blocks/marketing/DamiatLandingPage/DamiatLandingPage.tsx).

## Эффекты и производительность

- **Scroll bus:** `subscribeScrollFrame` — один rAF на кадр; **кэш** `getScrollRoot()` (без DOM-scan на каждый pixel); parallax через [`parallaxRegistry`](../../hooks/parallaxRegistry.ts).
- **Navbar:** `getScrollMetrics()` + гистерезис `pastBrandFold`.
- **lean:** `content-visibility` на секциях ([`damiatLandingScroll.css`](../../blocks/marketing/DamiatLandingPage/damiatLandingScroll.css)); HUD пауза при скролле (`useScrollIdle`).
- **Scroll depth reveal:** `ScrollDepthReveal` — варианты `depth` | `fade` ([`scrollDepthReveal.css`](../../blocks/_shared/scrollDepthReveal.css)).
- **Parallax:** `ParallaxLayer`, `useParallaxOffset`, `PhotoHeroBackdrop` (отключается в `lean`).
- **Hero HUD:** `DamiatGasOscilloscope` — пауза CSS-анимаций и telemetry вне viewport.
- **Navbar:** overlay enterprise, `pastBrandFold`, `--navbar-above-fold-band-height`.

Scroll-loop (`useScrollLoop`, `ScrollLoopShell`) **удалён**; `LoopScrollBridge` — deprecated alias для `DamiatBridgeSection`.

## Фоны photo-hero

| Ключ | Файл |
|------|------|
| `main` | `damiat-hero-main-bg.png` |
| `platform` | `potato-storage-monitoring-bg.png` |
| `case` | `damiat-gpd-case-bg.png` (GPD, 29.05.2026) |
| `closing` | `agro-tech-storage-bg.png` |

Контент моста: [`damiatBridgeContent.ts`](../blocks/marketing/damiatBridgeContent.ts).
