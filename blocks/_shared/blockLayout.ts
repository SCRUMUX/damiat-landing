import { cn } from '../../components/primitives/_shared';

/**
 * Marketing landing layout contract (B2B SaaS baseline — Linear / Stripe / Vercel).
 *
 * - One content column (`BLOCK_CONTENT_CLASS`) — same max-width and horizontal inset on every section.
 * - Section headers and body content align to the **start edge** of that column (not center).
 * - Full-bleed backgrounds and hero media are the only elements that break out.
 * - Center alignment is reserved for standalone hero pattern `marketing.hero.centered` only.
 *
 * Block style contract — card tiers, glass, surfaces (Radius + Effect contracts):
 *
 * Card tiers (opaque — NOT glass):
 * | Tier      | Class / token                         | Blocks                                      |
 * |-----------|---------------------------------------|---------------------------------------------|
 * | compact   | BLOCK_CARD_COMPACT_CLASS              | Features, Pricing, CTA, Events, catalog, Hero split media |
 * | standard  | BLOCK_CARD_STANDARD_*                 | Blog body, Services, Testimonials, Solutions, Trust, FAQ, WhyUs, ChooseUs |
 * | prominent | BLOCK_CARD_PROMINENT_SHELL_CLASS      | Blog scroll shell, Partner tiles            |
 * | enterprise media | BLOCK_HERO_ENTERPRISE_MEDIA_WRAP_CLASS | Layout-only column — no compact frame (bleeds on brand) |
 *
 * Glass (backdrop-blur + semantic fill — NOT card tiers):
 * | Type          | Class                         | Elements                                    |
 * |---------------|-------------------------------|---------------------------------------------|
 * | chrome        | BLOCK_GLASS_CHROME_CLASS        | Showcase panels, bordered chrome              |
 * | chrome navbar | BLOCK_GLASS_CHROME_NAVBAR_SOLID_CLASS | Navbar solid/scrolled (lighter frost)   |
 * | chrome overlay| BLOCK_GLASS_CHROME_OVERLAY_CLASS| Generic on-brand frost (panels)              |
 * | navbar overlay| BLOCK_GLASS_CHROME_NAVBAR_OVERLAY_CLASS | Enterprise navbar above fold      |
 * | chrome panel  | BLOCK_GLASS_CHROME_PANEL_CLASS  | Showcase desktop preview                    |
 * | brand panel   | BLOCK_GLASS_BRAND_PANEL_CLASS | ContactHero form shell                      |
 * | scrim         | BLOCK_GLASS_SCRIM_CLASS         | Navbar mobile services overlay              |
 *
 * No glass: accordion items, card tiers, ContactHero field inputs (border-only on glass panel).
 * Opaque chrome (not glass): Navbar services mega-menu panel — readable dropdown surface.
 *
 * Card tier exceptions (intentional — no BLOCK_CARD_* shell):
 * - StatsBlock — typography-only metrics on brand band
 * - NewsletterBlock — prose + form, no card wrapper
 * - HowItWorksBlock — rounded-full step index badges
 *
 * Inset contract (inner padding per card tier):
 * | Tier      | Class                              | Tokens                                      |
 * |-----------|------------------------------------|---------------------------------------------|
 * | compact   | BLOCK_CARD_COMPACT_INSET_CLASS     | `--space-inset-l`                           |
 * | standard  | BLOCK_CARD_STANDARD_INSET_CLASS    | `--space-inset-l` → desktop `--space-inset-xl` |
 *
 * Radius roles (interactive UI — not card outer shell):
 * | Role              | Class / component              | Token              |
 * |-------------------|--------------------------------|--------------------|
 * | Text CTA          | BlockAction / Button           | `--radius-button`  |
 * | Icon chip         | BLOCK_CHROME_ICON_CHIP_CLASS   | `--radius-medium`  |
 * | Chevron nav       | BLOCK_CHROME_SQUARE_CONTROL_CLASS | `--radius-pill` |
 * | ↗ arrow control   | BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS | `--radius-pill` + rotate |
 * | Card outer shell  | BLOCK_CARD_*_SHELL             | section → large    |
 * | Meta pill         | BLOCK_META_PILL_CLASS, SOLUTION_*_PILL | `--radius-medium/large` |
 *
 * Horizontal edge exceptions (intentional full-bleed / bleed-out):
 * - Partners marquee — PARTNERS_MARQUEE_VIEWPORT_CLASS
 * - Blog mobile scroll strip — BLOG_SCROLL_STRIP_CLASS (negative margin)
 * - Default — all card grids stay inside BLOCK_CONTENT_CLASS
 *
 * Block audit matrix (recipe / story): all 25 blocks use SectionShell + per-block stories;
 * LandingPageTemplate composes the full landing reference screen.
 *
 * Surfaces: cards → surface-1 + border-base; hover → brand border or elevation-2.
 */

/** Standard card — responsive radius only (no border/fill). */
export const BLOCK_CARD_STANDARD_RADIUS_CLASS = cn(
  'rounded-[var(--radius-section)]',
  'desktop:rounded-[var(--radius-large)]',
);

/** Standard card tier — inner padding (mobile inset-l, desktop inset-xl). */
export const BLOCK_CARD_STANDARD_INSET_CLASS = cn(
  'p-[var(--space-inset-l)]',
  'desktop:p-[var(--space-inset-xl)]',
);

/** Compact card tier — inner padding. */
export const BLOCK_CARD_COMPACT_INSET_CLASS = 'p-[var(--space-inset-l)]';

/** Compact card — feature grids, pricing tiers, catalog links. */
export const BLOCK_CARD_COMPACT_CLASS = cn(
  'rounded-[var(--radius-medium)] border border-solid border-[var(--color-border-base)] bg-[var(--color-surface-1)]',
);

/** Standard card — responsive radius; bordered content cards. */
export const BLOCK_CARD_STANDARD_SHELL_CLASS = cn(
  BLOCK_CARD_STANDARD_RADIUS_CLASS,
  'border border-solid border-[var(--color-border-base)] bg-[var(--color-surface-1)]',
);

/** Standard card with hover lift — interactive service / link cards. */
export const BLOCK_CARD_STANDARD_INTERACTIVE_CLASS = cn(
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  'transition-[transform,box-shadow,border-color] duration-200 ease-out',
  'hover:-translate-y-[var(--space-2)] hover:border-[var(--color-brand-primary)] hover:shadow-elevation-2',
);

/** Prominent card — partner tiles, scroll cards without border. */
export const BLOCK_CARD_PROMINENT_SHELL_CLASS = cn(
  BLOCK_CARD_STANDARD_RADIUS_CLASS,
  'bg-[var(--color-surface-1)]',
);

/** Events list row card — compact tier. */
export const BLOCK_EVENT_LIST_CARD_CLASS = cn(
  BLOCK_CARD_COMPACT_CLASS,
  BLOCK_CARD_COMPACT_INSET_CLASS,
);

/** Hero split media frame — compact tier. */
export const BLOCK_HERO_MEDIA_FRAME_CLASS = cn(
  BLOCK_CARD_COMPACT_CLASS,
  'w-full min-w-0 overflow-hidden bg-[var(--color-surface-2)]',
);

/** Enterprise hero media column — layout only (illustration bleeds on brand, no compact frame). */
export const BLOCK_HERO_ENTERPRISE_MEDIA_WRAP_CLASS = cn(
  'hidden w-full min-w-0 min-[1024px]:flex min-[1024px]:items-center min-[1024px]:justify-end',
);

/** Support mobile stats hero — standard radius + inset stack. */
export const BLOCK_SUPPORT_MOBILE_HERO_SHELL_CLASS = cn(
  BLOCK_CARD_STANDARD_RADIUS_CLASS,
  'relative overflow-hidden',
  'px-[var(--space-inset-l)] pb-[var(--space-inset-xl)] pt-[var(--space-120)]',
);

/** Support contact row — prominent fill on surface-2. */
export const BLOCK_SUPPORT_CONTACT_ROW_CLASS = cn(
  BLOCK_CARD_STANDARD_RADIUS_CLASS,
  'bg-[var(--color-surface-2)] px-[var(--space-inset-l)] py-[var(--space-inset-m)]',
);

/** Support stat card shell — standard tier + inset. */
export const BLOCK_SUPPORT_STAT_CARD_SHELL_CLASS = cn(
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'relative overflow-hidden',
);

/** Blog view-all link — standard card shell (prominent chrome). */
export const BLOCK_BLOG_CHROME_CONTROL_CLASS = cn(
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  'inline-flex items-center justify-center transition-colors duration-200',
  'hover:border-[var(--color-brand-primary)]',
);

/** Square icon nav control — blog prev/next chevrons. */
export const BLOCK_CHROME_SQUARE_CONTROL_CLASS = cn(
  'inline-flex items-center justify-center rounded-[var(--radius-pill)]',
  'border border-solid border-[var(--color-border-base)] bg-[var(--color-surface-1)]',
  'text-[var(--color-text-primary)]',
  'transition-[colors,transform] duration-200 ease-out',
  'hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-text-on-brand)]',
  'hover:scale-105',
);

/** Round ↗ arrow button — outline resting, brand fill + icon rotate on hover. */
export const BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS = cn(
  'group inline-flex shrink-0 items-center justify-center',
  'h-[var(--space-32)] w-[var(--space-32)]',
  'rounded-[var(--radius-pill)] border border-solid border-[var(--color-border-base)]',
  'bg-[var(--color-surface-1)] text-[var(--color-text-primary)]',
  'transition-[colors,transform] duration-200 ease-out',
  'hover:border-transparent hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-text-on-brand)]',
  'hover:scale-105',
);

/** Round icon button on brand band — events carousel prev/next. */
export const BLOCK_ON_BRAND_ICON_BUTTON_CLASS = cn(
  'inline-flex h-[var(--space-48)] w-[var(--space-48)] min-h-[var(--space-48)] min-w-[var(--space-48)]',
  'items-center justify-center rounded-[var(--radius-pill)] border p-0',
  'bg-[var(--color-text-on-brand)]/15 text-[var(--color-text-on-brand)]',
  'border-[var(--color-text-on-brand)]/25',
  'transition-[colors,transform] duration-200 ease-out',
  'hover:enabled:bg-[var(--color-text-on-brand)]/25 hover:enabled:scale-105',
  'disabled:cursor-not-allowed disabled:opacity-40',
);

/** Meta / date pill — shared chip padding (blog date, solution meta). */
export const BLOCK_META_PILL_CLASS = cn(
  'inline-flex w-fit max-w-full items-center text-nowrap',
  'rounded-[var(--radius-medium)] bg-[var(--color-surface-2)]',
  'px-[var(--space-4)] text-style-caption-xs text-[var(--color-text-secondary)]',
);

/** Blog post date pill — compact surface chip. */
export const BLOCK_BLOG_DATE_PILL_CLASS = cn(
  BLOCK_META_PILL_CLASS,
  'h-[var(--space-22)]',
);

/** Solution card category pill. */
export const SOLUTION_CATEGORY_PILL_CLASS = cn(
  BLOCK_META_PILL_CLASS,
  'gap-[var(--space-2)] rounded-[var(--radius-large)]',
  'h-[var(--space-28)]',
  'transition-colors duration-200',
  'desktop:group-hover:bg-[var(--color-surface-1)] desktop:group-hover:text-[var(--color-brand-primary)]',
);

/** Solution card meta pill (client, date). */
export const SOLUTION_META_PILL_CLASS = cn(
  BLOCK_META_PILL_CLASS,
  'rounded-[var(--radius-large)]',
  'h-[var(--space-22)]',
  'transition-colors duration-200',
  'desktop:group-hover:bg-[var(--color-surface-1)] desktop:group-hover:text-[var(--color-text-primary)]',
);

/** Small icon chip — blog view-all, trust pillar icon slot. */
export const BLOCK_CHROME_ICON_CHIP_CLASS = cn(
  'inline-flex items-center justify-center rounded-[var(--radius-medium)] bg-[var(--color-surface-2)]',
  'h-[var(--space-24)] w-[var(--space-24)] min-[1024px]:h-[var(--space-28)] min-[1024px]:w-[var(--space-28)]',
);

/** Blog post ↗ link — round arrow control (inherits BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS). */
export const BLOCK_BLOG_ARROW_LINK_CLASS = cn(
  BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS,
  'no-underline',
);

/** Trust pillar / card media slot — compact tier fill. */
export const BLOCK_SURFACE_MEDIA_SLOT_CLASS = cn(
  'relative h-[var(--space-120)] w-full shrink-0 overflow-hidden',
  'rounded-[var(--radius-medium)] bg-[var(--color-surface-2)]',
);

/** Trust secondary pillar — Synaptik icon, no meta background. */
export const TRUST_PILLAR_ICON_SLOT_CLASS = cn(
  'relative flex w-full shrink-0 items-center justify-start',
  'h-[var(--space-140)] min-[1024px]:h-[var(--space-168)]',
);

/** Trust secondary pillar — icon left, copy right (e.g. «Участие в выставках»). */
export const TRUST_PILLAR_SECONDARY_ROW_CLASS = cn(
  'relative z-[2] flex w-full min-w-0 items-center',
  'gap-[var(--space-section-content-m)] min-[1024px]:gap-[var(--space-section-content-l)]',
);

/** Trust secondary pillar — large icon slot (primary-scale plate). */
export const TRUST_PILLAR_SECONDARY_ICON_CLASS = cn(
  'flex shrink-0 items-center justify-center',
  'min-w-[var(--space-120)] min-[1024px]:min-w-[var(--space-140)]',
);

/** Solution case card ↗ — round brand fill; hover deepens brand + icon rotate (card `group`). */
export const SOLUTION_ARROW_BUTTON_CLASS = cn(
  'group inline-flex shrink-0 items-center justify-center',
  'h-[var(--space-32)] w-[var(--space-32)] rounded-[var(--radius-pill)]',
  'border border-transparent bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
  'transition-[colors,transform] duration-200 ease-out',
  'desktop:group-hover:bg-[var(--color-brand-hover)] desktop:group-hover:scale-105',
);

/** Glass chrome — sticky/floating UI (showcase preview, bordered panels). */
export const BLOCK_GLASS_CHROME_CLASS = cn(
  'backdrop-blur-background',
  'bg-[var(--effect-glass-chrome-bg)]',
  'shadow-elevation-1',
  'border-b border-[var(--color-border-base)]',
);

/** Glass chrome — navbar solid/scrolled header (lighter than panels so blur reads on scroll). */
export const BLOCK_GLASS_CHROME_NAVBAR_SOLID_CLASS = cn(
  'backdrop-blur-background',
  'bg-[color-mix(in_srgb,var(--color-surface-1)_68%,transparent)]',
  'shadow-elevation-1',
);

/** Glass chrome on brand — generic overlay (panels). */
export const BLOCK_GLASS_CHROME_OVERLAY_CLASS = cn(
  'backdrop-blur-background',
  'bg-[color-mix(in_srgb,var(--color-text-on-brand)_30%,transparent)]',
  'border-b border-[var(--color-text-on-brand)]/30',
  'shadow-[inset_0_-1px_0_color-mix(in_srgb,var(--color-text-on-brand)_12%,transparent)]',
);

/** Glass chrome — enterprise navbar overlay on brand hero (no border; brand-tinted frost). */
export const BLOCK_GLASS_CHROME_NAVBAR_OVERLAY_CLASS = cn(
  'backdrop-blur-background',
  'bg-[color-mix(in_srgb,var(--color-brand-primary)_62%,transparent)]',
);

/** Glass chrome panel — bordered floating panel over brand/content (showcase preview). */
export const BLOCK_GLASS_CHROME_PANEL_CLASS = cn(
  BLOCK_GLASS_CHROME_CLASS,
  'rounded-[var(--radius-section)] border border-solid border-[var(--color-border-base)]',
  'shadow-elevation-2',
  'min-[1024px]:rounded-[var(--radius-large)]',
);

/** Glass brand panel — form shell on brand parallax (ContactHero). */
export const BLOCK_GLASS_BRAND_PANEL_CLASS = cn(
  'rounded-[var(--radius-section)] border border-solid',
  'backdrop-blur-background',
  'border-[color-mix(in_srgb,var(--color-text-on-brand)_14%,transparent)]',
  'bg-[color-mix(in_srgb,var(--color-brand-primary)_50%,transparent)]',
  'min-[1024px]:rounded-[var(--radius-large)]',
);

/** Glass scrim — modal/drawer backdrop with blur. */
export const BLOCK_GLASS_SCRIM_CLASS = cn(
  'backdrop-blur-background',
  'bg-[var(--effect-glass-scrim-bg)]',
);

/** Calculator — decorative ambient layer (blobs) for readable glass blur on base sections. */
export const BLOCK_CALCULATOR_AMBIENT_CLASS =
  'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]';

/** Calculator — unified glass workspace (form + chart + summary). */
export const BLOCK_CALCULATOR_WORKSPACE_CLASS = cn(
  BLOCK_GLASS_CHROME_PANEL_CLASS,
  'relative z-10',
  'bg-[color-mix(in_srgb,var(--color-surface-1)_82%,transparent)]',
  'p-[var(--space-inset-l)]',
  'desktop:p-[var(--space-inset-xl)]',
);

/** Calculator — two-column grid inside workspace. */
export const BLOCK_CALCULATOR_GRID_CLASS = cn(
  'grid w-full min-w-0 grid-cols-1 items-stretch gap-[var(--space-section-content-l)]',
  'min-[1024px]:grid-cols-[minmax(0,var(--space-320))_minmax(0,1fr)]',
);

/** @deprecated Use BLOCK_GLASS_CHROME_PANEL_CLASS */
export const BLOCK_GLASS_PANEL_CLASS = BLOCK_GLASS_CHROME_PANEL_CLASS;

/** Standard card media — blog / service cover image slot. */
export const BLOCK_CARD_MEDIA_CLASS = cn(
  'aspect-[416/270] w-full shrink-0 rounded-[var(--radius-section)] object-cover',
  'desktop:rounded-[var(--radius-large)]',
);

/** Horizontal inset only — matches landing page rhythm (no max-width). */
export const BLOCK_HORIZONTAL_INSET_CLASS = cn(
  'px-[var(--grid-mobile-offset)]',
  'tablet:px-[var(--grid-tablet-offset)]',
  'desktop:px-[var(--grid-desktop-offset)]',
);

/** Shared page content shell — all sections share this horizontal box. */
export const BLOCK_CONTENT_CLASS = cn(
  'mx-auto w-full box-border',
  'max-w-[var(--grid-desktop-breakpoint)]',
  BLOCK_HORIZONTAL_INSET_CLASS,
);

/** Readable prose width, anchored to the content column start (not centered). */
export const BLOCK_PROSE_CLASS = 'w-full max-w-[var(--space-640)] min-w-0';

/** Left-aligned action button row. */
export const BLOCK_ACTIONS_ROW_CLASS =
  'flex w-full min-w-0 flex-wrap items-center justify-start';

export const BLOCK_GRID_COL_CLASS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 min-[768px]:grid-cols-2',
  3: 'grid-cols-1 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3',
  4: 'grid-cols-2 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-4',
} as const;

export const BLOCK_GRID_BASE_CLASS = cn(
  'grid w-full min-w-0 items-stretch',
  'gap-[var(--grid-mobile-gutter)]',
  'tablet:gap-[var(--grid-tablet-gutter)]',
  'min-[1024px]:gap-[var(--grid-desktop-gutter)]',
);

export const BLOCK_GRID_ITEM_CLASS = 'min-w-0 h-full';

export const BLOCK_SPLIT_CLASS = cn(
  BLOCK_GRID_BASE_CLASS,
  'grid-cols-1 min-[1024px]:grid-cols-2 min-[1024px]:items-center',
);

/** Events featured band — narrow title/nav column + wide event content (Cortel). */
export const EVENTS_FEATURED_SPLIT_CLASS = cn(
  BLOCK_GRID_BASE_CLASS,
  'grid-cols-1 min-[1024px]:grid-cols-[minmax(0,var(--space-280))_minmax(0,1fr)]',
  'min-[1024px]:items-start min-[1024px]:gap-[var(--space-80)]',
);

/** Solutions desktop mosaic — 12-col: row1 (4+4+4), row2 (6+3+3) (Cortel). */
export const SOLUTIONS_DESKTOP_GRID_CLASS = cn(
  BLOCK_GRID_BASE_CLASS,
  'grid-cols-12',
);

/** Solutions mobile/tablet — horizontal case-study scroll strip. */
export const SOLUTIONS_SCROLL_STRIP_CLASS = cn(
  'flex w-full min-w-0 overflow-x-auto',
  'h-[var(--space-360)]',
  'gap-[var(--grid-mobile-gutter)]',
  'tablet:gap-[var(--grid-tablet-gutter)]',
  '[&>*]:min-w-[var(--space-320)] [&>*]:max-w-[var(--space-320)] [&>*]:shrink-0',
  'snap-x snap-mandatory [&>*]:snap-start',
);

/** Solutions equal grid — case detail related projects (Cortel 3-col). */
export const SOLUTIONS_EQUAL_GRID_CLASS = cn(
  'grid w-full min-w-0',
  'grid-cols-1 gap-[var(--space-16)]',
  'min-[768px]:grid-cols-2',
  'min-[1024px]:grid-cols-3',
);

/** Solutions catalog — Cortel /solutions: equal 3-col grid, bordered hover cards. */
export const SOLUTIONS_CATALOG_GRID_CLASS = cn(
  'm-0 grid w-full min-w-0 list-none gap-[var(--space-16)] p-0',
  'min-[1024px]:grid-cols-3',
);

export const SOLUTIONS_CATALOG_CARD_SHELL_CLASS = cn(
  BLOCK_CARD_COMPACT_CLASS,
  'relative transition-[border-color] duration-200',
  'hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-surface-1)]',
);

export const SOLUTIONS_CATALOG_CARD_LINK_CLASS = cn(
  'group relative flex h-full w-full min-w-0 flex-col',
  'gap-[var(--space-8)] no-underline text-inherit',
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'min-[1024px]:gap-[var(--space-12)]',
);

export const SOLUTIONS_CATALOG_HEADER_ROW_CLASS = cn(
  'flex min-w-0 items-start gap-[var(--space-12)]',
  'pr-[calc(var(--space-32)+var(--space-inset-l))]',
  'desktop:pr-[calc(var(--space-32)+var(--space-inset-xl))]',
);

export const SOLUTIONS_CATALOG_ICON_CLASS = cn('shrink-0', '[&_img]:object-contain');

export const SOLUTIONS_CATALOG_TITLE_CLASS = cn(
  'm-0 text-balance font-medium text-style-h4 text-[var(--color-text-primary)]',
  'min-[1024px]:text-style-body-lg',
);

export const SOLUTIONS_CATALOG_DESCRIPTION_CLASS = cn(
  'm-0 text-balance text-style-body-lg text-[var(--color-text-secondary)]',
);

export const SOLUTIONS_CATALOG_ARROW_CLASS = cn(
  BLOCK_CHROME_ROUND_ARROW_BUTTON_CLASS,
  'absolute right-[var(--space-inset-l)] top-[var(--space-inset-l)]',
  'desktop:right-[var(--space-inset-xl)] desktop:top-[var(--space-inset-xl)]',
  'group-hover:border-transparent group-hover:bg-[var(--color-brand-primary)] group-hover:text-[var(--color-text-on-brand)]',
  'group-hover:scale-105',
);

/** Solutions page hero — Cortel /solutions muted panel + decorative media. */
export const SOLUTIONS_HERO_SHELL_CLASS = cn(
  'relative mx-auto w-full min-w-0 overflow-visible',
  'max-lg:pb-[var(--space-120)]',
  'min-[1024px]:pt-[var(--space-48)] min-[1024px]:pb-[var(--space-160)]',
);

export const SOLUTIONS_HERO_STAGE_CLASS = 'relative min-w-0 overflow-visible';

export const SOLUTIONS_HERO_PANEL_CLASS = cn(
  'relative z-[1] flex w-full min-w-0 flex-col',
  'min-h-[var(--space-535)] justify-between rounded-[var(--radius-medium)] bg-[var(--color-surface-2)] p-[var(--space-24)]',
  'min-[1024px]:min-h-[var(--space-280)] min-[1024px]:justify-start min-[1024px]:gap-[var(--space-24)]',
  'min-[1024px]:rounded-[var(--radius-large)] min-[1024px]:px-[var(--space-32)] min-[1024px]:py-[var(--space-32)]',
);

export const SOLUTIONS_HERO_TITLE_CLASS = cn(
  'm-0 max-w-[var(--space-584)] whitespace-pre-line font-medium text-style-display text-[var(--color-text-primary)]',
);

export const SOLUTIONS_HERO_DESCRIPTION_CLASS = cn(
  'm-0 mt-[var(--space-12)] max-w-[var(--space-584)] whitespace-pre-line text-style-body text-[var(--color-text-secondary)]',
  'min-[1024px]:mt-[var(--space-24)] min-[1024px]:text-style-body-lg',
);

/** Desktop — vertically centered on panel, overflows top/bottom (Cortel hero-d). */
export const SOLUTIONS_HERO_MEDIA_WRAP_CLASS = cn(
  'pointer-events-none absolute z-[2]',
  'max-lg:left-1/2 max-lg:bottom-0 max-lg:w-full max-lg:max-w-[var(--space-309)] max-lg:-translate-x-1/2 max-lg:translate-y-[42%]',
  'min-[1024px]:right-[var(--space-67)] min-[1024px]:top-1/2 min-[1024px]:w-[var(--space-488)] min-[1024px]:max-w-[var(--space-488)] min-[1024px]:-translate-y-1/2 min-[1024px]:translate-x-0',
);

/** Trust pillars — 4-up row, fixed height on desktop (Cortel). */
export const TRUST_PILLARS_ROW_CLASS = cn(
  'flex w-full min-w-0 flex-col',
  'gap-[var(--space-section-stack-s)]',
  'min-[1024px]:h-[var(--space-280)] min-[1024px]:flex-row min-[1024px]:gap-[var(--space-section-content-m)]',
);

/** Trust standards — sidebar + 3-col link grid. */
export const TRUST_STANDARDS_SPLIT_CLASS = cn(
  BLOCK_GRID_BASE_CLASS,
  'grid-cols-1 min-[1024px]:grid-cols-[minmax(0,var(--space-280))_minmax(0,1fr)]',
  'min-[1024px]:items-start min-[1024px]:gap-[var(--space-80)]',
);

export const TRUST_STANDARDS_GRID_CLASS = cn(
  BLOCK_GRID_BASE_CLASS,
  'grid-cols-1 min-[1024px]:grid-cols-3',
  'gap-[var(--space-section-content-m)] min-[1024px]:gap-x-[var(--space-section-content-l)] min-[1024px]:gap-y-[var(--space-36)]',
);

/** Support header — title + description split (Cortel). */
export const SUPPORT_HEADER_SPLIT_CLASS = cn(
  'flex w-full min-w-0 flex-col',
  'gap-[var(--space-section-content-m)]',
  'mb-[var(--space-section-content-m)] min-[1024px]:mb-[var(--space-section-content-l)]',
  'min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-[var(--space-section-content-l)]',
);

/** Support desktop body — left column (featured stat + contacts) + side stat cards. */
export const SUPPORT_DESKTOP_ROW_CLASS = cn(
  'w-full min-w-0 items-stretch',
  'gap-[var(--space-section-content-m)]',
);

export const SUPPORT_SIDE_STATS_CLASS = cn(
  'flex min-w-0 flex-1',
  'gap-[var(--space-section-content-m)]',
);

export const SUPPORT_CONTACTS_STACK_CLASS = cn(
  'flex w-full min-w-0 flex-col',
  'gap-[var(--space-section-stack-s)] min-[1024px]:gap-[var(--space-section-content-m)]',
);

/** Showcase panel — shared min-height row (accordion + preview on brand bg). */
export const SHOWCASE_PANEL_FRAME_CLASS = cn(
  'flex w-full min-w-0 flex-col',
  'mt-[var(--space-section-content-m)]',
  'min-[1024px]:mt-[var(--space-section-content-l)] min-[1024px]:min-h-[var(--space-600)]',
  'min-[1024px]:flex-row min-[1024px]:items-stretch min-[1024px]:gap-[var(--space-section-content-l)]',
);

/** Left accordion column — cards stack on transparent brand surface. */
export const SHOWCASE_PANEL_ACCORDION_COLUMN_CLASS = cn(
  'flex min-h-0 w-full shrink-0 flex-col text-[var(--color-text-primary)]',
  'min-[1024px]:h-[var(--space-600)] min-[1024px]:w-[var(--space-460)]',
);

/** Right preview column — light floating panel (Cortel LK mock). */
export const SHOWCASE_PANEL_PREVIEW_COLUMN_CLASS = cn(
  'relative hidden min-h-0 min-[1024px]:block min-[1024px]:h-[var(--space-600)] min-[1024px]:min-w-0 min-[1024px]:flex-[2] min-[1024px]:basis-2/3',
);

/** Logo cloud — equal tiles across the full content width. */
export const BLOCK_LOGO_GRID_CLASS = cn(
  'grid w-full min-w-0',
  'grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-5',
  'gap-[var(--grid-mobile-gutter)]',
  'tablet:gap-[var(--grid-tablet-gutter)]',
  'min-[1024px]:gap-[var(--grid-desktop-gutter)]',
);

/** Blog header — title/subtitle left, view-all + nav right (Cortel). */
export const BLOG_HEADER_ROW_CLASS = cn(
  'flex w-full min-w-0 flex-col',
  'gap-[var(--space-section-content-m)]',
  'mb-[var(--space-section-content-m)] min-[1024px]:mb-[var(--space-section-content-l)]',
  'min-[1024px]:flex-row min-[1024px]:items-end min-[1024px]:justify-between',
);

export const BLOG_HEADER_TITLE_GROUP_CLASS = cn(
  'flex min-w-0 flex-col',
  'gap-[var(--space-section-stack-m)]',
);

/** Blog scroll viewport. */
export const BLOG_SCROLL_VIEWPORT_CLASS = 'relative w-full min-w-0';

/** Blog horizontal slider — mobile/tablet touch swipe; scrollbar hidden. */
export const BLOG_SCROLL_STRIP_CLASS = cn(
  'flex w-full min-w-0 overflow-x-auto scroll-smooth',
  'gap-[var(--space-section-stack-s)]',
  'snap-x snap-mandatory [&>*]:snap-start',
  '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  '-mx-[var(--grid-mobile-offset)] px-[var(--grid-mobile-offset)]',
  'tablet:-mx-[var(--grid-tablet-offset)] tablet:px-[var(--grid-tablet-offset)]',
);

/** Desktop button-driven track — no user scroll, no scrollbar. */
export const BLOG_DESKTOP_TRACK_VIEWPORT_CLASS = 'w-full min-w-0 overflow-hidden';

export const BLOG_DESKTOP_TRACK_CLASS = cn(
  'flex w-max min-w-0',
  'gap-[var(--space-section-stack-s)]',
  'transition-transform duration-300 ease-out',
  'will-change-transform',
);

/** Blog post card shell — Cortel 310×492 / 416×572 (tightened body rhythm). */
export const BLOG_CARD_CLASS = cn(
  'flex h-[var(--space-460)] w-[var(--space-320)] shrink-0 snap-start flex-col',
  BLOCK_CARD_PROMINENT_SHELL_CLASS,
  'px-[var(--space-2)] pb-[var(--space-inset-l)] pt-[var(--space-2)]',
  'min-[1024px]:h-[var(--space-530)] min-[1024px]:w-[var(--space-416)]',
);

/** Partners band — left-aligned title (AICADS content column). */
export const PARTNERS_HEADER_CLASS = cn(
  'mb-[var(--space-section-content-m)] text-left',
  'min-[1024px]:mb-[var(--space-42)]',
);

/** Partners marquee viewport — full-bleed strip with edge fades (Cortel). */
export const PARTNERS_MARQUEE_VIEWPORT_CLASS = cn(
  'relative w-screen max-w-[100vw] left-1/2 -translate-x-1/2',
);

export const PARTNERS_MARQUEE_FADE_LEFT_CLASS = cn(
  'pointer-events-none absolute left-0 top-0 z-[1] h-full w-[var(--space-78)]',
  'min-[1024px]:w-[var(--space-169)]',
);

export const PARTNERS_MARQUEE_FADE_RIGHT_CLASS = cn(
  'pointer-events-none absolute right-0 top-0 z-[1] h-full w-[var(--space-78)]',
  'min-[1024px]:w-[var(--space-169)]',
);

/** Second marquee row offset (Cortel mt-2). */
export const PARTNERS_MARQUEE_ROW_GAP_CLASS = 'mt-[var(--space-2)]';

/** Partner logo tile — white card, grayscale → color on hover. */
export const PARTNER_TILE_CLASS = cn(
  'flex shrink-0 cursor-pointer items-center justify-center',
  BLOCK_CARD_PROMINENT_SHELL_CLASS,
  'h-[var(--space-100)] w-[var(--space-164)] px-[var(--space-inset-s)] py-[var(--space-12)]',
  'min-[1024px]:h-[var(--space-120)] min-[1024px]:w-[var(--space-190)]',
  'transition-all duration-300',
  'grayscale opacity-80 hover:grayscale-0 hover:opacity-100',
);

export const PARTNER_LOGO_IMAGE_CLASS = cn(
  'h-full w-full max-h-full max-w-full object-contain object-center',
);

/** Contact hero — split copy + glass form (Cortel action band). */
export const CONTACT_HERO_SPLIT_CLASS = cn(
  'flex w-full min-w-0 flex-col',
  'gap-[var(--space-section-content-l)]',
  'min-[1024px]:flex-row min-[1024px]:items-start min-[1024px]:justify-between min-[1024px]:gap-[var(--space-36)]',
);

export const CONTACT_HERO_COPY_CLASS = cn(
  'flex min-w-0 flex-col',
  'min-[1024px]:max-w-[var(--space-554)]',
);

export const CONTACT_HERO_DESCRIPTION_CLASS = cn(
  'mt-[var(--space-section-stack-m)] text-[var(--color-text-on-brand)] opacity-80 text-style-body',
  'text-balance min-[1024px]:mt-[var(--space-60)] min-[1024px]:max-w-[var(--space-440)] min-[1024px]:text-style-body-lg',
);

export const CONTACT_HERO_FORM_COLUMN_CLASS = cn(
  'w-full min-w-0 shrink-0',
  'min-[1024px]:max-w-[var(--space-640)] min-[1024px]:flex-[0_1_640px]',
);

export const CONTACT_HERO_FORM_SHELL_CLASS = cn(
  BLOCK_GLASS_BRAND_PANEL_CLASS,
  'p-[var(--space-inset-l)] min-[1024px]:p-[var(--space-60)]',
);

export const CONTACT_HERO_FIELDS_STACK_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-12)]',
);

export const CONTACT_HERO_FIELD_ROW_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-12)]',
  'min-[1024px]:flex-row min-[1024px]:gap-[var(--space-12)]',
);

/** @deprecated Use BLOCK_PROSE_CLASS — kept for import stability. */
export const BLOCK_NARROW_CLASS = BLOCK_PROSE_CLASS;

const FOOTER_GRADIENT_LINE =
  'linear-gradient(90deg, color-mix(in srgb, var(--color-text-on-brand) 20%, transparent) 0%, var(--color-text-on-brand) 50%, color-mix(in srgb, var(--color-text-on-brand) 20%, transparent) 100%)';

/** Cortel footer — top gradient hairline on brand surface. */
export const FOOTER_TOP_DIVIDER_CLASS = 'h-px w-full';

export const FOOTER_TOP_DIVIDER_STYLE = { background: FOOTER_GRADIENT_LINE } as const;

/** Enterprise footer desktop row — logo column + 3-col grid. */
export const FOOTER_ENTERPRISE_DESKTOP_ROW_CLASS = cn(
  'hidden w-full min-w-0 items-stretch justify-between',
  'min-[1024px]:flex min-[1024px]:py-[var(--space-60)] min-[1024px]:gap-[var(--space-109)]',
);

export const FOOTER_ENTERPRISE_LOGO_COLUMN_CLASS = cn(
  'flex min-h-full min-w-0 flex-col justify-between',
);

export const FOOTER_ENTERPRISE_GRID_CLASS = cn(
  'grid w-full min-w-0 max-w-[var(--space-852)] grid-cols-3 gap-[var(--space-40)]',
);

export const FOOTER_ENTERPRISE_NAV_STACK_CLASS = cn(
  'flex flex-col gap-[var(--space-8)]',
);

export const FOOTER_ENTERPRISE_CONTACTS_STACK_CLASS = cn(
  'flex h-full flex-col justify-between gap-[var(--space-20)]',
);

export const FOOTER_ENTERPRISE_LEGAL_STACK_CLASS = cn(
  'flex h-full flex-col gap-[var(--space-8)]',
);

/** Enterprise footer mobile stack. */
export const FOOTER_ENTERPRISE_MOBILE_STACK_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-32)] py-[var(--space-48)]',
  'min-[1024px]:hidden',
);

/** Why us — Cortel vmware page: 2+featured row, 3-card row + mobile featured. */
export const WHY_US_TITLE_CLASS = cn(
  'm-0 mb-[var(--space-32)] font-medium text-style-h1 text-[var(--color-text-primary)]',
  'min-[1024px]:mb-[var(--space-44)]',
);

export const WHY_US_ROW_TOP_CLASS = cn(
  'grid w-full min-w-0 gap-[var(--space-16)]',
  'min-[1024px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)]',
);

export const WHY_US_ROW_BOTTOM_CLASS = cn(
  'mt-[var(--space-16)] grid w-full min-w-0 gap-[var(--space-16)]',
  'min-[1024px]:grid-cols-3',
);

export const WHY_US_CARD_CLASS = cn(
  'flex min-h-[var(--space-302)] flex-col justify-between',
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'bg-[var(--color-surface-1)] transition-[border-color] duration-200',
  'hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-surface-1)]',
  'min-[1024px]:h-full',
);

export const WHY_US_CARD_BODY_CLASS = cn(
  'flex h-full flex-col gap-[var(--space-12)]',
  'min-[1024px]:justify-start min-[1024px]:gap-0',
);

export const WHY_US_CARD_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h4 text-[var(--color-text-primary)]',
  'min-[1024px]:text-style-body-lg',
);

export const WHY_US_CARD_DESCRIPTION_CLASS = cn(
  'm-0 font-normal text-style-body-lg text-[var(--color-text-secondary)]',
  'min-[1024px]:mt-[var(--space-14)]',
);

export const WHY_US_CARD_ICON_SLOT_CLASS = cn(
  'mt-[var(--space-16)] flex shrink-0 items-end justify-end self-end',
  'h-[var(--space-50)] w-[var(--space-50)]',
  'min-[1024px]:mt-[var(--space-12)] min-[1024px]:h-[var(--space-100)] min-[1024px]:w-[var(--space-100)]',
);

export const WHY_US_FEATURED_CLASS = cn(
  'relative flex overflow-hidden rounded-[var(--radius-large)]',
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'h-[var(--space-296)] min-[1024px]:h-full',
);

export const WHY_US_FEATURED_PRIMARY_CLASS = cn(
  'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
);

/** Text-only scrim for primary featured — bottom-left, does not cover corner icon. */
export const DAMIAT_PRIMARY_FEATURED_TEXT_SCRIM_CLASS = cn(
  'pointer-events-none absolute inset-0 z-[1]',
  'bg-[radial-gradient(ellipse_120%_90%_at_16%_100%,color-mix(in_srgb,var(--color-brand-primary)_48%,black),transparent_70%)]',
);

/** Corner slot for glass icon frame on brand primary featured cards (interactive). */
export const DAMIAT_PRIMARY_FEATURED_ICON_SLOT_CLASS = cn(
  'pointer-events-auto absolute bottom-[var(--space-16)] right-[var(--space-16)] z-[3]',
  'flex max-h-[58%] max-w-[52%] items-end justify-end',
  'min-[1024px]:bottom-[var(--space-24)] min-[1024px]:right-[var(--space-24)]',
);

/** Gradient rim — transitions from bright edge into glass fill. */
export const DAMIAT_PRIMARY_FEATURED_ICON_PLATE_BORDER_CLASS = cn(
  'group/plate relative max-w-full shrink-0 rounded-[var(--radius-section)] p-px',
  'desktop:rounded-[var(--radius-large)]',
  'bg-[linear-gradient(148deg,color-mix(in_srgb,var(--color-text-on-brand)_52%,transparent)_0%,color-mix(in_srgb,var(--color-text-on-brand)_18%,transparent)_40%,color-mix(in_srgb,var(--color-brand-hover)_72%,transparent)_100%)]',
  'shadow-[0_10px_28px_rgba(0,0,0,0.2)]',
  'transition-[transform,box-shadow,background] duration-200 ease-out',
  'hover:-translate-y-[var(--space-2)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]',
  'hover:bg-[linear-gradient(148deg,color-mix(in_srgb,var(--color-text-on-brand)_62%,transparent)_0%,color-mix(in_srgb,var(--color-text-on-brand)_28%,transparent)_42%,color-mix(in_srgb,var(--color-brand-primary)_58%,transparent)_100%)]',
);

/**
 * Frosted glass inset (backdrop-blur on brand — not applied to img pixels).
 * @see BLOCK_GLASS_CHROME_OVERLAY_CLASS
 */
export const DAMIAT_PRIMARY_FEATURED_ICON_PLATE_CLASS = cn(
  'relative overflow-hidden rounded-[inherit]',
  'rounded-[calc(var(--radius-section)-1px)] desktop:rounded-[calc(var(--radius-large)-1px)]',
  'backdrop-blur-background',
  'bg-[color-mix(in_srgb,var(--color-text-on-brand)_14%,transparent)]',
  'p-[var(--space-10)] desktop:p-[var(--space-14)]',
  'shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-text-on-brand)_42%,transparent)]',
  'transition-[background] duration-200 ease-out',
  'group-hover/plate:bg-[color-mix(in_srgb,var(--color-text-on-brand)_22%,transparent)]',
);

export const DAMIAT_PRIMARY_FEATURED_ICON_PLATE_SHEEN_CLASS = cn(
  'pointer-events-none absolute inset-0 rounded-[inherit]',
  'bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-text-on-brand)_26%,transparent)_0%,transparent_52%)]',
  'transition-opacity duration-200 group-hover/plate:opacity-90',
);

export const DAMIAT_PRIMARY_FEATURED_ICON_PLATE_EDGE_CLASS = cn(
  'pointer-events-none absolute inset-0 rounded-[inherit]',
  'ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-text-on-brand)_22%,transparent)]',
);

/** Raster clip — same radius family as glass shell. */
export const DAMIAT_PRIMARY_FEATURED_ICON_IMAGE_WRAP_CLASS = cn(
  'relative z-[1] overflow-hidden',
  'rounded-[var(--radius-medium)] desktop:rounded-[var(--radius-section)]',
  'bg-[var(--color-surface-1)]',
  'transition-[transform] duration-200 ease-out',
  'group-hover/plate:scale-[1.02]',
);

export const DAMIAT_PRIMARY_FEATURED_ICON_IMAGE_CLASS = cn(
  'block max-h-[var(--space-120)] w-auto max-w-full object-contain',
  'desktop:max-h-[var(--space-160)]',
);

/** @deprecated Use DAMIAT_PRIMARY_FEATURED_TEXT_SCRIM_CLASS */
export const WHY_US_FEATURED_MEDIA_SCRIM_CLASS = DAMIAT_PRIMARY_FEATURED_TEXT_SCRIM_CLASS;

export const WHY_US_FEATURED_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h4 text-[var(--color-text-on-brand)]',
  'min-[1024px]:text-style-h3',
);

export const WHY_US_FEATURED_DESCRIPTION_CLASS = cn(
  'mt-[var(--space-12)] text-style-body text-[var(--color-text-on-brand)]',
);

/** Decorative brand highlight — artistic blur (NOT UI glass / backdrop-blur). */
export const WHY_US_DECORATIVE_HIGHLIGHT_CLASS = cn(
  'absolute right-[-20%] top-[-10%] h-[70%] w-[70%] rotate-12 opacity-40 blur-[var(--space-40)]',
);

/** Choose us — Cortel /company «Почему нас выбирают»: 5-card mosaic + featured panel. */
export const CHOOSE_US_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h1 text-[var(--color-text-primary)]',
);

export const CHOOSE_US_BODY_CLASS = cn(
  'mt-[var(--space-28)] grid w-full min-w-0 grid-cols-1 gap-[var(--space-16)]',
  'desktop:mt-[var(--space-42)] desktop:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] desktop:items-stretch',
);

export const CHOOSE_US_CARD_LIST_CLASS = cn(
  'm-0 grid w-full min-w-0 list-none grid-cols-1 gap-[var(--space-16)] p-0',
  'desktop:grid-cols-6',
);

export const CHOOSE_US_CARD_CLASS = cn(
  'flex min-h-0 flex-col justify-between',
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
);

export const CHOOSE_US_CARD_BODY_CLASS = cn(
  'flex min-w-0 flex-col gap-[var(--space-12)]',
  'desktop:gap-[var(--space-8)]',
);

export const CHOOSE_US_CARD_WIDE_CLASS = cn(
  'desktop:col-span-3 desktop:min-h-[var(--space-272)]',
);

export const CHOOSE_US_CARD_NARROW_CLASS = cn(
  'desktop:col-span-2 desktop:min-h-[var(--space-320)]',
);

export const CHOOSE_US_CARD_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h4 text-[var(--color-text-primary)]',
  'desktop:text-style-body-lg',
);

export const CHOOSE_US_CARD_DESCRIPTION_CLASS = cn(
  'm-0 font-normal text-style-body text-[var(--color-text-secondary)]',
  'desktop:text-style-body-sm',
);

export const CHOOSE_US_CARD_ICON_SLOT_CLASS = cn(
  'mt-[var(--space-16)] flex shrink-0 self-end',
  'h-[var(--space-50)] w-[var(--space-50)]',
  'desktop:mt-[var(--space-12)] desktop:h-[var(--space-100)] desktop:w-[var(--space-100)]',
);

export const CHOOSE_US_FEATURED_CLASS = cn(
  'relative flex h-[var(--space-300)] w-full shrink-0 flex-col justify-end overflow-hidden',
  'rounded-[var(--radius-section)] bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'desktop:h-auto desktop:min-h-[var(--space-608)] desktop:rounded-[var(--radius-large)]',
  'desktop:gap-[var(--space-16)]',
);

/** @deprecated Use DAMIAT_PRIMARY_FEATURED_TEXT_SCRIM_CLASS */
export const CHOOSE_US_FEATURED_MEDIA_SCRIM_CLASS = DAMIAT_PRIMARY_FEATURED_TEXT_SCRIM_CLASS;

export const CHOOSE_US_FEATURED_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h3 text-[var(--color-text-on-brand)]',
  'desktop:text-style-h2',
);

export const CHOOSE_US_FEATURED_DESCRIPTION_CLASS = cn(
  'm-0 font-normal text-style-body text-[var(--color-text-on-brand)]',
  'desktop:max-w-[var(--space-300)] desktop:text-style-body-sm',
);

/** Process timeline — Cortel vmware «Как выглядит процесс». */
export const PROCESS_TITLE_CLASS = cn(
  'm-0 mb-[var(--space-32)] font-medium text-style-h1 text-[var(--color-text-primary)]',
  'min-[1024px]:mb-[var(--space-48)]',
);

export const PROCESS_TIMELINE_VIEWPORT_CLASS = 'relative w-full min-w-0';

export const PROCESS_TIMELINE_TRACK_BASE_CLASS = cn(
  'pointer-events-none absolute',
  'left-[var(--space-24)] top-0 h-full w-px',
  'min-[1024px]:bottom-[var(--space-6)] min-[1024px]:left-[var(--space-28)] min-[1024px]:top-auto min-[1024px]:h-px min-[1024px]:w-full',
);

export const PROCESS_TIMELINE_TRACK_PROGRESS_CLASS = cn(
  'pointer-events-none absolute',
  'left-[var(--space-24)] top-0 h-full w-px',
  'min-[1024px]:bottom-[var(--space-6)] min-[1024px]:left-[var(--space-28)] min-[1024px]:top-auto min-[1024px]:h-px min-[1024px]:w-full',
);

export const PROCESS_STEPS_LIST_CLASS = cn(
  'relative m-0 flex list-none flex-col p-0',
  'mt-[var(--space-28)] gap-[var(--space-14)]',
  'min-[1024px]:mt-[var(--space-42)] min-[1024px]:flex-row min-[1024px]:items-stretch min-[1024px]:gap-[var(--space-15)]',
);

export const PROCESS_STEP_ITEM_CLASS = cn(
  'flex items-center gap-[var(--space-12)]',
  'min-[1024px]:w-full min-[1024px]:flex-col-reverse min-[1024px]:gap-[var(--space-16)]',
);

export const PROCESS_STEP_MARKER_CLASS = cn(
  'flex w-[var(--space-36)] shrink-0 flex-col-reverse items-center gap-[var(--space-4)]',
  'text-style-body-lg font-normal text-[var(--color-text-secondary)]',
  'min-[1024px]:flex-col-reverse min-[1024px]:gap-[var(--space-12)]',
);

export const PROCESS_STEP_CARD_CLASS = cn(
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'min-[1024px]:min-h-[var(--space-240)] min-[1024px]:max-w-[var(--space-320)]',
);

export const PROCESS_STEP_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h4 text-[var(--color-text-primary)]',
  'min-[1024px]:max-w-[var(--space-170)] min-[1024px]:text-style-body-lg',
);

export const PROCESS_STEP_DESCRIPTION_CLASS = cn(
  'm-0 mt-[var(--space-8)] font-normal text-style-body-lg text-[var(--color-text-secondary)]',
  'min-[1024px]:mt-[var(--space-20)]',
);

/** Auth login — Cortel console: split brand decor + white form panel. */
export const LOGIN_PAGE_SPLIT_CLASS = cn(
  'flex min-h-screen w-full min-w-0 flex-col',
  'min-[1024px]:flex-row',
);

export const LOGIN_BRAND_PANEL_CLASS = cn(
  'relative hidden min-h-[var(--space-240)] overflow-hidden',
  'bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]',
  'min-[1024px]:flex min-[1024px]:min-h-screen min-[1024px]:min-w-0 min-[1024px]:flex-1',
);

export const LOGIN_FORM_PANEL_CLASS = cn(
  'flex min-h-screen min-w-0 flex-1 flex-col',
  'bg-[var(--color-surface-1)] text-[var(--color-text-primary)]',
);

export const LOGIN_FORM_INNER_CLASS = cn(
  'flex w-full min-w-0 flex-1 flex-col justify-center',
  'px-[var(--space-inset-l)] py-[var(--space-section-y-l)]',
  'min-[1024px]:px-[var(--space-60)] min-[1024px]:py-[var(--space-section-y-xl)]',
);

export const LOGIN_FORM_COLUMN_CLASS = cn(
  'mx-auto w-full min-w-0 max-w-[var(--space-480)]',
);

export const LOGIN_FORM_HEADER_CLASS = cn(
  'mb-[var(--space-section-content-m)] flex w-full min-w-0 flex-col items-start',
  'gap-[var(--space-section-stack-s)]',
);

export const LOGIN_FORM_STACK_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-section-stack-m)]',
);

export const LOGIN_REMEMBER_FORGOT_ROW_CLASS = cn(
  'flex w-full min-w-0 items-center justify-between gap-[var(--space-section-stack-m)]',
);

export const LOGIN_REGISTRATION_HINT_CLASS = cn(
  'm-0 text-style-body-sm text-[var(--color-text-secondary)]',
);

export const LOGIN_LEGAL_FOOTER_CLASS = cn(
  'mt-auto flex w-full min-w-0 flex-wrap items-center justify-center gap-[var(--space-section-stack-m)]',
  'border-t border-solid border-[var(--color-border-base)]',
  'px-[var(--space-inset-l)] py-[var(--space-section-stack-m)]',
  'min-[1024px]:px-[var(--space-60)]',
);

/** @deprecated Use LOGIN_PAGE_SPLIT_CLASS — kept for import stability. */
export const LOGIN_PAGE_CENTER_CLASS = LOGIN_FORM_INNER_CLASS;

/** @deprecated Split layout — form is flat on white panel, no card shell. */
export const LOGIN_CARD_CLASS = LOGIN_FORM_COLUMN_CLASS;

/** @deprecated Use LOGIN_FORM_HEADER_CLASS */
export const LOGIN_CARD_HEADER_CLASS = LOGIN_FORM_HEADER_CLASS;

/** Case study detail — unified long-read article stack (Cortel case page). */
export const CASE_STUDY_ARTICLE_STACK_CLASS = cn(
  'flex w-full min-w-0 flex-col',
  'gap-[var(--space-section-content-l)]',
);

/** Case study — desktop split: sticky anchor nav + content column. */
export const CASE_STUDY_ARTICLE_SPLIT_CLASS = cn(
  'grid w-full min-w-0',
  'grid-cols-1 gap-[var(--space-section-content-l)]',
  'min-[1024px]:grid-cols-[minmax(0,var(--space-280))_minmax(0,1fr)]',
  'min-[1024px]:items-start min-[1024px]:gap-[var(--space-section-content-l)]',
);

export const CASE_STUDY_ARTICLE_CONTENT_STACK_CLASS = cn(
  'flex w-full min-w-0 max-w-[var(--space-800)] flex-col',
  'gap-[var(--space-section-content-l)]',
);

export const CASE_STUDY_ANCHOR_NAV_STICKY_CLASS = cn(
  'hidden min-[1024px]:block',
  'sticky z-[calc(var(--z-header)-2)] self-start',
  'top-[var(--navbar-chrome-height,0px)]',
  'pt-[var(--space-section-stack-s)]',
);

export const CASE_STUDY_ANCHOR_LIST_CLASS = cn(
  'm-0 flex list-none flex-col gap-[var(--space-section-stack-s)] p-0',
);

/** Side nav link — shared by case-study anchor nav and app-shell sidebar. */
export const BLOCK_SIDE_NAV_LINK_CLASS = cn(
  'block rounded-[var(--radius-section)] px-[var(--space-inset-m)] py-[var(--space-section-stack-s)]',
  'text-left text-style-body text-[var(--color-text-secondary)] no-underline',
  'transition-colors duration-150',
  'hover:text-[var(--color-text-primary)]',
);

export const BLOCK_SIDE_NAV_LINK_ACTIVE_CLASS = cn(
  BLOCK_SIDE_NAV_LINK_CLASS,
  'bg-[var(--color-surface-2)] font-medium text-[var(--color-text-primary)]',
);

export const CASE_STUDY_ANCHOR_LINK_CLASS = cn(BLOCK_SIDE_NAV_LINK_CLASS, 'w-full');

export const CASE_STUDY_ANCHOR_LINK_ACTIVE_CLASS = cn(
  BLOCK_SIDE_NAV_LINK_ACTIVE_CLASS,
  'w-full',
);

/** Compact gray stat card — case study inline stats and cabinet KPI strip. */
export const BLOCK_COMPACT_STAT_CARD_CLASS = cn(
  BLOCK_CARD_COMPACT_CLASS,
  BLOCK_CARD_COMPACT_INSET_CLASS,
  'flex min-w-0 flex-col gap-[var(--space-section-stack-s)]',
  'bg-[var(--color-surface-2)]',
);

export const CASE_STUDY_STAT_CARD_CLASS = BLOCK_COMPACT_STAT_CARD_CLASS;

/** Case study inline stats — 2-col grid inside article column. */
export const CASE_STUDY_INLINE_STATS_GRID_CLASS = cn(
  'grid w-full min-w-0',
  'grid-cols-1 gap-[var(--space-section-content-m)]',
  'min-[768px]:grid-cols-2 min-[768px]:gap-x-[var(--space-section-content-l)]',
);

export const CASE_STUDY_INLINE_STAT_VALUE_CLASS = cn(
  'm-0 font-semibold text-style-h2 text-[var(--color-text-primary)]',
);

export const CASE_STUDY_INLINE_STAT_LABEL_CLASS = cn(
  'm-0 text-style-body-lg text-[var(--color-text-secondary)]',
);

export const BLOCK_COMPACT_STAT_VALUE_CLASS = CASE_STUDY_INLINE_STAT_VALUE_CLASS;
export const BLOCK_COMPACT_STAT_LABEL_CLASS = CASE_STUDY_INLINE_STAT_LABEL_CLASS;

/** Case study detail — intro prose column (Cortel long-read). */
export const CASE_STUDY_PROSE_CLASS = cn(
  'flex w-full min-w-0 max-w-[var(--space-800)] flex-col',
  'gap-[var(--space-section-stack-m)]',
);

export const CASE_STUDY_PROSE_PARAGRAPH_CLASS = cn(
  'm-0 text-style-body-lg text-[var(--color-text-secondary)]',
  'min-[1024px]:text-style-body-xl',
);

/** Case study intro — highlight metric pairs below prose. */
export const CASE_STUDY_HIGHLIGHTS_GRID_CLASS = cn(
  'grid w-full min-w-0 max-w-[var(--space-800)]',
  'grid-cols-1 gap-[var(--space-section-content-m)]',
  'min-[768px]:grid-cols-2 min-[768px]:gap-x-[var(--space-section-content-l)]',
);

export const CASE_STUDY_HIGHLIGHT_CELL_CLASS = cn(
  'flex min-w-0 flex-col gap-[var(--space-section-stack-s)]',
);

export const CASE_STUDY_HIGHLIGHT_LABEL_CLASS = cn(
  'm-0 text-style-body text-[var(--color-text-secondary)]',
);

export const CASE_STUDY_HIGHLIGHT_VALUE_CLASS = cn(
  'm-0 font-semibold text-style-h3 text-[var(--color-brand-primary)]',
  'min-[1024px]:text-style-h2',
);

/** Case study narrative sections stack. */
export const CASE_STUDY_SECTIONS_STACK_CLASS = cn(
  'flex w-full min-w-0 flex-col',
  'gap-[var(--space-section-content-l)]',
);

export const CASE_STUDY_SECTION_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h2 text-[var(--color-text-primary)]',
);

export const CASE_STUDY_SECTION_BODY_CLASS = cn(
  'flex flex-col gap-[var(--space-section-stack-m)]',
);

export const CASE_STUDY_SECTION_PARAGRAPH_CLASS = CASE_STUDY_PROSE_PARAGRAPH_CLASS;

export const CASE_STUDY_BULLETS_CLASS = cn(
  'm-0 flex flex-col gap-[var(--space-section-stack-s)] pl-[var(--space-inset-m)]',
  'text-style-body-lg text-[var(--color-text-secondary)] min-[1024px]:text-style-body-xl',
  'list-disc marker:text-[var(--color-brand-primary)]',
);

export const CASE_STUDY_QUOTE_CLASS = cn(
  'relative m-0 border-0 border-l-[var(--space-4)] border-solid border-[var(--color-brand-primary)]',
  'py-[var(--space-section-stack-s)] pl-[var(--space-inset-l)]',
  'text-style-body-lg italic text-[var(--color-text-primary)]',
  'min-[1024px]:text-style-body-xl',
);

export const CASE_STUDY_QUOTE_ATTRIBUTION_CLASS = cn(
  'mt-[var(--space-section-stack-m)] not-italic text-style-body-sm text-[var(--color-text-secondary)]',
);

/** Case study contact — surface split + white form card override. */
export const CASE_STUDY_CONTACT_SPLIT_CLASS = CONTACT_HERO_SPLIT_CLASS;

export const CASE_STUDY_CONTACT_COPY_CLASS = CONTACT_HERO_COPY_CLASS;

export const CASE_STUDY_CONTACT_DESCRIPTION_CLASS = cn(
  'mt-[var(--space-section-stack-m)] text-balance text-style-body-lg text-[var(--color-text-secondary)]',
  'min-[1024px]:mt-[var(--space-section-content-m)] min-[1024px]:max-w-[var(--space-440)]',
);

export const CASE_STUDY_CONTACT_FORM_WRAP_CLASS = cn(
  CONTACT_HERO_FORM_COLUMN_CLASS,
  '[&_form]:rounded-[var(--radius-section)]',
  '[&_form]:border [&_form]:border-solid [&_form]:border-[var(--color-border-base)]',
  '[&_form]:bg-[var(--color-surface-1)]',
  '[&_form]:shadow-elevation-1',
  '[&_form]:backdrop-blur-none',
  '[&_label]:text-[var(--color-text-secondary)] [&_label]:opacity-100',
  'min-[1024px]:[&_form]:rounded-[var(--radius-large)]',
);

/** App shell — dashboard sidebar + main (LK / console). */
export const APP_SHELL_ROOT_CLASS = cn(
  'flex min-h-[100svh] w-full bg-[var(--color-surface-1)]',
);

/** Shared header row — sidebar logo + main topbar (same height and inset). */
export const APP_SHELL_CHROME_ROW_CLASS = cn(
  'flex shrink-0 items-center',
  'min-h-[var(--space-48)]',
  'py-[var(--space-inset-m)]',
);

export const APP_SHELL_SIDEBAR_CLASS = cn(
  'hidden min-h-[100svh] min-[1024px]:flex',
  'w-[var(--space-280)] shrink-0 flex-col',
  'border-r border-solid border-[var(--color-border-base)]',
  'bg-[var(--color-surface-1)]',
);

export const APP_SHELL_SIDEBAR_HEADER_CLASS = cn(
  APP_SHELL_CHROME_ROW_CLASS,
  'border-b border-solid border-[var(--color-border-base)]',
  'px-[var(--space-inset-l)]',
);

export const APP_SHELL_SIDEBAR_LOGO_CLASS = cn(
  'm-0 font-semibold text-style-h4 text-[var(--color-brand-primary)]',
);

export const APP_SHELL_SIDEBAR_NAV_CLASS = cn(
  'm-0 flex list-none flex-col gap-[var(--space-section-stack-s)] p-0',
  'px-[var(--space-inset-l)] py-[var(--space-inset-m)]',
);

export const APP_SHELL_MAIN_WRAP_CLASS = cn(
  'flex min-h-[100svh] min-w-0 flex-1 flex-col',
);

export const APP_SHELL_TOPBAR_CLASS = cn(
  APP_SHELL_CHROME_ROW_CLASS,
  'justify-between gap-[var(--space-section-content-m)]',
  'border-b border-solid border-[var(--color-border-base)]',
  'bg-[var(--color-surface-1)] px-[var(--space-inset-l)]',
);

export const APP_SHELL_TOPBAR_CONTEXT_CLASS = cn(
  'm-0 min-w-0 font-medium text-style-h4 text-[var(--color-text-primary)]',
);

export const APP_SHELL_TOPBAR_USER_CLASS = cn(
  'shrink-0 text-style-body-sm text-[var(--color-text-secondary)]',
);

export const APP_SHELL_MOBILE_NAV_CLASS = cn(
  'flex shrink-0 overflow-x-auto min-[1024px]:hidden',
  'gap-[var(--space-section-stack-s)]',
  'border-b border-solid border-[var(--color-border-base)]',
  'px-[var(--space-inset-l)] py-[var(--space-inset-s)]',
);

export const APP_SHELL_MOBILE_NAV_LIST_CLASS = cn(
  'm-0 flex list-none gap-[var(--space-section-stack-s)] p-0',
);

export const APP_SHELL_NAV_ICON_ROW_CLASS = cn(
  'inline-flex items-center gap-[var(--space-section-stack-s)]',
);

export const APP_SHELL_NAV_LINK_CLASS = cn(BLOCK_SIDE_NAV_LINK_CLASS, 'whitespace-nowrap');

export const APP_SHELL_NAV_LINK_ACTIVE_CLASS = cn(
  BLOCK_SIDE_NAV_LINK_ACTIVE_CLASS,
  'whitespace-nowrap',
);

export const APP_SHELL_MAIN_CLASS = cn(
  'flex min-h-0 flex-1 flex-col min-w-0 overflow-y-auto',
);

export const APP_SHELL_MAIN_INNER_CLASS = cn(
  'flex min-h-0 w-full flex-1 flex-col',
  'gap-[var(--space-content-s)]',
  'px-[var(--space-inset-l)] py-[var(--space-inset-m)]',
);

/** Cabinet KPI strip — 4 telemetry tiles in app main. */
export const CABINET_STATS_STRIP_CLASS = cn(
  'grid w-full min-w-0',
  'grid-cols-2 gap-[var(--space-section-content-m)]',
  'min-[768px]:grid-cols-4',
);

export const CABINET_STAT_CARD_CLASS = BLOCK_COMPACT_STAT_CARD_CLASS;

export const CABINET_STAT_VALUE_CLASS = BLOCK_COMPACT_STAT_VALUE_CLASS;

export const CABINET_STAT_LABEL_CLASS = BLOCK_COMPACT_STAT_LABEL_CLASS;

export const CABINET_SCENARIO_SUMMARY_GRID_CLASS = cn(
  'grid w-full min-w-0',
  'grid-cols-1 gap-[var(--space-section-content-m)]',
  'min-[768px]:grid-cols-3',
);

export const CABINET_SCENARIO_SUMMARY_CARD_CLASS = cn(
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'flex min-w-0 flex-col gap-[var(--space-section-stack-m)]',
  'bg-[var(--color-surface-1)]',
);

export const CABINET_OVERVIEW_SECTION_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)]',
);

export const CABINET_SECTION_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h4 text-[var(--color-text-primary)]',
);

export const CABINET_SCENARIO_SUMMARY_TITLE_CLASS = CABINET_SECTION_TITLE_CLASS;

export const CABINET_SCENARIO_SUMMARY_ITEM_TITLE_CLASS = cn(
  'font-medium text-style-h4 text-[var(--color-text-primary)]',
);

export const CABINET_SCENARIO_SUMMARY_METRIC_CLASS = CASE_STUDY_HIGHLIGHT_VALUE_CLASS;

export const CABINET_SCENARIO_SUMMARY_CARD_INTERACTIVE_CLASS = cn(
  CABINET_SCENARIO_SUMMARY_CARD_CLASS,
  'cursor-pointer border-0 text-left transition-colors duration-150',
  'hover:bg-[var(--color-surface-2)]',
  'outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]',
);

/** Status pill — monitoring panels and cabinet scenario summary. */
export const BLOCK_STATUS_PILL_BASE_CLASS = cn(
  'inline-flex w-fit items-center rounded-[var(--radius-medium)] border px-[var(--space-10)] py-[var(--space-4)]',
  'text-style-caption font-normal leading-snug',
);

export const BLOCK_STATUS_PILL_OK_CLASS = cn(
  BLOCK_STATUS_PILL_BASE_CLASS,
  'border-[var(--color-brand-primary)] bg-[var(--color-brand-muted)] text-[var(--color-brand-primary)]',
);

export const BLOCK_STATUS_PILL_WATCH_CLASS = cn(
  BLOCK_STATUS_PILL_BASE_CLASS,
  'border-[var(--color-warning-base)] bg-[color-mix(in_srgb,var(--color-warning-hover-bg)_75%,var(--color-surface-1))] text-[var(--color-text-primary)]',
);

export const BLOCK_STATUS_PILL_ALERT_CLASS = cn(
  BLOCK_STATUS_PILL_BASE_CLASS,
  'border-[var(--color-danger-base)] bg-[color-mix(in_srgb,var(--color-danger-subtle)_75%,var(--color-surface-1))] text-[var(--color-text-primary)]',
);

export const MONITORING_WORKSPACE_SHELL_CLASS = cn(
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)]',
  'bg-[var(--color-surface-1)]',
  'min-h-0',
);

export const MONITORING_WORKSPACE_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h3 text-[var(--color-text-primary)]',
);

/** Admin panel — app-shell workspaces (cases, events, users, partners). */
export const ADMIN_WORKSPACE_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-section-content-m)]',
);

export const ADMIN_TOOLBAR_CLASS = cn(
  'flex w-full min-w-0 flex-wrap items-center justify-between gap-[var(--space-section-content-m)]',
);

export const ADMIN_TOOLBAR_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h4 text-[var(--color-text-primary)]',
);

export const ADMIN_TOOLBAR_ACTIONS_CLASS = cn(
  'flex min-w-0 flex-wrap items-center gap-[var(--space-section-stack-s)]',
);

export const ADMIN_TABLE_WRAP_CLASS = cn('w-full min-w-0 overflow-x-auto');

export const ADMIN_EDITOR_SPLIT_CLASS = cn(
  'grid w-full min-w-0',
  'grid-cols-1 gap-[var(--space-section-content-m)]',
  'min-[1024px]:grid-cols-[var(--space-240)_minmax(0,1fr)] min-[1024px]:gap-[var(--space-section-content-l)]',
);

export const ADMIN_EDITOR_NAV_STICKY_CLASS = cn(
  'min-[1024px]:sticky min-[1024px]:self-start',
  'min-[1024px]:top-[var(--space-section-stack-m)]',
);

export const ADMIN_EDITOR_NAV_LIST_CLASS = cn(
  'm-0 flex list-none flex-col gap-[var(--space-section-stack-s)] p-0',
  'max-[1023px]:flex-row max-[1023px]:overflow-x-auto max-[1023px]:pb-[var(--space-inset-s)]',
);

export const ADMIN_EDITOR_NAV_LINK_CLASS = cn(
  BLOCK_SIDE_NAV_LINK_CLASS,
  'whitespace-nowrap max-[1023px]:shrink-0',
);

export const ADMIN_EDITOR_NAV_LINK_ACTIVE_CLASS = cn(
  BLOCK_SIDE_NAV_LINK_ACTIVE_CLASS,
  'whitespace-nowrap max-[1023px]:shrink-0',
);

export const ADMIN_EDITOR_FORM_PANEL_CLASS = cn(
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'flex min-w-0 flex-col gap-[var(--space-section-content-m)]',
  'bg-[var(--color-surface-1)]',
);

export const ADMIN_FORM_STACK_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-section-stack-m)]',
);

export const ADMIN_FORM_SECTION_TITLE_CLASS = cn(
  'm-0 font-medium text-style-h4 text-[var(--color-text-primary)]',
);

export const ADMIN_FORM_FIELD_LABEL_CLASS = cn(
  'mb-[var(--space-6)] block text-style-body font-medium text-[var(--color-text-secondary)]',
);

export const ADMIN_REPEATABLE_ITEM_CLASS = cn(
  BLOCK_CARD_STANDARD_SHELL_CLASS,
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'flex min-w-0 flex-col gap-[var(--space-section-stack-m)]',
  'bg-[var(--color-surface-2)]',
);

export const ADMIN_REPEATABLE_ACTIONS_CLASS = cn(
  'flex flex-wrap items-center gap-[var(--space-section-stack-s)]',
);

export const ADMIN_PARTNER_GRID_CLASS = cn(
  'grid w-full min-w-0',
  'grid-cols-2 gap-[var(--space-section-content-m)]',
  'min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4',
);

export const ADMIN_PARTNER_TILE_CLASS = cn(
  BLOCK_CARD_COMPACT_CLASS,
  BLOCK_CARD_COMPACT_INSET_CLASS,
  'relative flex min-w-0 flex-col gap-[var(--space-section-stack-s)]',
  'bg-[var(--color-surface-2)]',
);

export const ADMIN_PARTNER_LOGO_CLASS = cn(
  'mx-auto h-[var(--space-48)] w-full max-w-[var(--space-120)] object-contain',
);

export const ADMIN_EMPTY_STATE_CLASS = cn(
  'flex w-full min-w-0 flex-col items-center justify-center gap-[var(--space-section-stack-m)]',
  'rounded-[var(--radius-section)] border border-dashed border-[var(--color-border-base)]',
  'bg-[var(--color-surface-2)] px-[var(--space-inset-l)] py-[var(--space-section-content-l)]',
  'text-center text-style-body text-[var(--color-text-secondary)]',
);

/** FAQ enterprise — Cortel vmware card accordion. */
export const FAQ_ENTERPRISE_TITLE_CLASS = cn(
  'm-0 mb-[var(--space-32)] font-medium text-style-h1 text-[var(--color-text-primary)]',
  'min-[1024px]:mb-[var(--space-48)]',
);

export const FAQ_ENTERPRISE_LIST_CLASS = cn(
  'flex w-full min-w-0 flex-col gap-[var(--space-12)]',
);

export const FAQ_ENTERPRISE_ITEM_CLASS = cn(
  'group overflow-hidden bg-[var(--color-surface-2)] transition-all duration-200',
  BLOCK_CARD_STANDARD_SHELL_CLASS,
);

export const FAQ_ENTERPRISE_TRIGGER_CLASS = cn(
  'flex w-full min-w-0 items-center gap-[var(--space-16)] border-0 bg-transparent text-left',
  BLOCK_CARD_STANDARD_INSET_CLASS,
  'min-[1024px]:gap-[var(--space-24)]',
  'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]',
);

export const FAQ_ENTERPRISE_TOGGLE_CLASS = cn(
  'ml-auto flex h-[var(--space-32)] w-[var(--space-32)] shrink-0 items-center justify-center',
  'rounded-[var(--radius-pill)] border border-solid border-[var(--color-border-base)]',
  'bg-[var(--color-surface-1)] text-[var(--color-text-primary)]',
  'transition-[colors,transform] duration-200 ease-out',
  'group-hover:border-transparent group-hover:bg-[var(--color-brand-primary)] group-hover:text-[var(--color-text-on-brand)]',
  'group-hover:scale-105',
  'group-data-[state=open]:border-transparent group-data-[state=open]:bg-[var(--color-brand-primary)] group-data-[state=open]:text-[var(--color-text-on-brand)]',
);

export const FAQ_ENTERPRISE_QUESTION_CLASS = cn(
  'min-w-0 flex-1 font-medium text-style-h4 text-[var(--color-text-primary)]',
  'min-[1024px]:text-style-body-lg',
);

export const FAQ_ENTERPRISE_ANSWER_CLASS = cn(
  'px-[var(--space-inset-l)] pb-[var(--space-inset-l)] pt-[var(--space-8)] text-style-body text-[var(--color-text-secondary)]',
  'desktop:px-[var(--space-inset-xl)] desktop:pb-[var(--space-inset-xl)] desktop:pt-[var(--space-8)]',
  '[&_a]:text-[var(--color-brand-primary)] [&_a]:no-underline [&_a]:hover:underline',
);
