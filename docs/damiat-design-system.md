# DAMIAT Design System

**Agro Capital Intelligence UI** — цветовая система: [`../etc/DAMIAT-Color-System.pdf`](../etc/DAMIAT-Color-System.pdf)  
Полный UI kit (типографика, радиусы, motion): [`../etc/DAMIAT-Design-System.pdf`](../etc/DAMIAT-Design-System.pdf)

Машиночитаемые токены: [`../etc/damiat-tokens.json`](../etc/damiat-tokens.json) → `ai-ds-spec.json` → `npm run tokens:build` → `config/css-variables/tokens.css`.

## 1. Концепция цвета

Цветовая система построена вокруг идеи:

- **Урожай** = финансовый актив
- **Хранение** = управление капиталом
- **Интерфейс** = система принятия решений

**Тон:** financial · controlled · calm · premium industrial · capital-oriented.

**Смысловой сдвиг (критично):**

| Элемент | Было | Стало |
|---------|------|-------|
| Зелёный | природа | прибыль |
| Картофель | агро продукт | актив |
| Хранилище | склад | инфраструктура капитала |
| Графики | агро данные | финансовые потоки |

Интерфейс должен восприниматься как **система управления доходностью агро-активов**, а не как сайт сельхоз-оборудования.

## 2. Base layer (фон и поверхности)

| Token (PDF) | Hex | AICADS semantic |
|-------------|-----|-----------------|
| `--bg-primary` | `#F7F8F5` | `--color-bg-base` |
| `--bg-secondary` | `#EEF2EC` | `--color-bg-muted` |
| `--surface` | `#FFFFFF` | `--color-surface-1` |
| `--surface-muted` | `#F1F4F0` | `--color-surface-2` |

Тёплый нейтральный фон — без холодного blue-SaaS.

## 3. Text system

| Token | Hex | AICADS |
|-------|-----|--------|
| `--text-primary` | `#0E1512` | `--color-text-primary` |
| `--text-secondary` | `#2C3A34` | `--color-text-secondary` |
| `--text-muted` | `#6B7C73` | `--color-text-muted` |

## 4. Core Brand Green (структура)

| Token | Hex | Использование |
|-------|-----|---------------|
| `--green-900` | `#0B3D2E` | dashboards, ключевые панели, navbar overlay |
| `--green-800` | `#0F4D3A` | серьёзные блоки |
| `--green-700` | `#146B4F` | data zones, pressed states |

## 5. Growth / Profit Green (акцент)

| Token | Hex | AICADS | Использование |
|-------|-----|--------|---------------|
| `--green-primary` | `#22A06B` | `--color-brand-primary` | DAMIAT Index, CTA, profit |
| `--green-accent` | `#2BCB7A` | `--color-brand-hover` | активные состояния |
| `--green-soft` | `#A7E6C4` | `--color-brand-muted` | фоновые подсветки |

**Иерархия зелёного:** Core Green → структура · Growth Green → динамика · Soft Green → фон.

## 6. Data dark layer (аналитика)

| Token | Hex | AICADS |
|-------|-----|--------|
| `--data-900` | `#0C1F18` | `--core-data-900` |
| `--data-800` | `#102820` | `--core-data-800` |
| `--data-700` | `#143329` | `--core-data-700` |

Charts · telemetry · SCADA · real-time dashboards.

## 7. Status colors

| Token | Hex | Смысл |
|-------|-----|-------|
| `--success` | `#22A06B` | норма / рост |
| `--warning` | `#E6A23C` | риск |
| `--danger` | `#E25555` | критично |

## 8. Neutral / UI support

| Token | Hex | AICADS |
|-------|-----|--------|
| `--border` | `#D9E2DA` | `--color-border-base` |
| `--divider` | `#E6EEE8` | `--color-divider` |
| hover | `rgba(20, 107, 79, 0.06)` | `--color-brand-hover-bg` |

## 9. Overlay & depth

| Token | Значение |
|-------|----------|
| `--overlay-light` | `rgba(255, 255, 255, 0.6)` |
| `--overlay-dark` | `rgba(0, 0, 0, 0.25)` |

## 10. Shadows

База `#0E1512`:

- **sm:** `0 2px 10px rgba(14, 21, 18, 0.06)` → `--shadow-sm`
- **md:** `0 10px 30px rgba(14, 21, 18, 0.10)` → `--shadow-md`
- **lg:** `0 20px 60px rgba(14, 21, 18, 0.14)` → `--shadow-lg`

## 11. Правила (IMPORTANT)

### 11.1 Иерархия зелёного

1. **Core Green** — структура, серьёзные блоки  
2. **Growth Green** — прибыль, изменения, динамика  
3. **Soft Green** — фон, подсветки  

### 11.2 NEVER USE

- neon cyan  
- blue SaaS palette  
- pure bright green (`#00FF00`)  
- «eco green» branding  

## 12. Типографика

- **Inter** — основной (`--font-family-base`)
- **Manrope** — альтернатива (`--font-family-alt`)
- Цифры: `font-variant-numeric: tabular-nums` (`.text-style-tabular`)

| Роль | Size / Line |
|------|-------------|
| H1 | 48 / 56 |
| H2 | 36 / 44 |
| H3 | 28 / 36 |
| Body | 16 / 24 |
| Small | 14 / 20 |

## 13. Сетка, радиусы, motion

- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px  
- Radius: sm 12 · md 20 · lg 28 · xl 36  
- Glass: `backdrop-blur: 12px`, overlay-light 60%  
- Motion: 200–600ms, ease-out (Calm Motion System)

## 14. Иконки

outline, 1.5px stroke, без заливок, единый набор.
