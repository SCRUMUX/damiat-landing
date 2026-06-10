import { cn } from '@ai-ds/core/shared';
import { BLOCK_GLASS_CHROME_PANEL_CLASS } from '@ai-ds/core/blocks/_shared/blockLayout';

/** Damiat calculator workspace — product-only layout tokens. */
export const BLOCK_CALCULATOR_AMBIENT_CLASS =
  'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]';

export const BLOCK_CALCULATOR_WORKSPACE_CLASS = cn(
  BLOCK_GLASS_CHROME_PANEL_CLASS,
  'relative z-10',
  'bg-[color-mix(in_srgb,var(--color-surface-1)_82%,transparent)]',
  'p-[var(--space-inset-l)]',
  'desktop:p-[var(--space-inset-xl)]',
);

export const BLOCK_CALCULATOR_GRID_CLASS = cn(
  'grid w-full min-w-0 grid-cols-1 items-stretch gap-[var(--space-section-content-l)]',
  'min-[1024px]:grid-cols-[minmax(0,var(--space-320))_minmax(0,1fr)]',
);

export const DAMIAT_PRIMARY_FEATURED_TEXT_SCRIM_CLASS = cn(
  'pointer-events-none absolute inset-0 z-[1]',
  'bg-[radial-gradient(ellipse_120%_90%_at_16%_100%,color-mix(in_srgb,var(--color-brand-primary)_48%,black),transparent_70%)]',
);

export const DAMIAT_PRIMARY_FEATURED_ICON_SLOT_CLASS = cn(
  'pointer-events-auto absolute bottom-[var(--space-16)] right-[var(--space-16)] z-[3]',
  'flex max-h-[58%] max-w-[52%] items-end justify-end',
  'min-[1024px]:bottom-[var(--space-24)] min-[1024px]:right-[var(--space-24)]',
);

export const DAMIAT_PRIMARY_FEATURED_ICON_PLATE_BORDER_CLASS = cn(
  'group/plate relative max-w-full shrink-0 rounded-[var(--radius-section)] p-px',
  'desktop:rounded-[var(--radius-large)]',
  'bg-[linear-gradient(148deg,color-mix(in_srgb,var(--color-text-on-brand)_52%,transparent)_0%,color-mix(in_srgb,var(--color-text-on-brand)_18%,transparent)_40%,color-mix(in_srgb,var(--color-brand-hover)_72%,transparent)_100%)]',
  'shadow-[0_10px_28px_rgba(0,0,0,0.2)]',
  'transition-[transform,box-shadow,background] duration-200 ease-out',
  'hover:-translate-y-[var(--space-2)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]',
  'hover:bg-[linear-gradient(148deg,color-mix(in_srgb,var(--color-text-on-brand)_62%,transparent)_0%,color-mix(in_srgb,var(--color-text-on-brand)_28%,transparent)_42%,color-mix(in_srgb,var(--color-brand-primary)_58%,transparent)_100%)]',
);

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
