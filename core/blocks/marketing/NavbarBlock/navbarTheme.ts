/** Shared surface tokens for enterprise navbar sub-regions. */

import { cn } from '../../../components/primitives/_shared';
import {
  BLOCK_GLASS_CHROME_NAVBAR_OVERLAY_CLASS,
  BLOCK_GLASS_CHROME_NAVBAR_SOLID_CLASS,
} from '../../_shared/blockLayout';

export type NavbarSurface = 'overlay' | 'solid';

export function resolveNavbarSurface(
  overlay: boolean,
  scrolled: boolean,
  servicesOpen: boolean,
): NavbarSurface {
  return overlay && !scrolled && !servicesOpen ? 'overlay' : 'solid';
}

/** Light glass on photo hero — stays transparent while scrolling. */
export const NAVBAR_STATIC_GLASS_HEADER_CLASS = cn(
  'backdrop-blur-background',
  'bg-[color-mix(in_srgb,var(--core-green-900)_28%,transparent)]',
  'shadow-elevation-1',
);

export const NAVBAR_SURFACE = {
  header: {
    overlay: BLOCK_GLASS_CHROME_NAVBAR_OVERLAY_CLASS,
    solid: BLOCK_GLASS_CHROME_NAVBAR_SOLID_CLASS,
    staticGlass: NAVBAR_STATIC_GLASS_HEADER_CLASS,
  },
  text: {
    overlay: 'text-[var(--color-text-on-brand)]',
    solid: 'text-[var(--color-text-primary)]',
  },
  socialRail: {
    overlay: 'bg-transparent text-[var(--color-text-on-brand)]',
    solid: 'bg-transparent text-[var(--color-text-primary)]',
  },
  socialIcon: {
    overlay: 'text-[var(--color-text-on-brand)] hover:opacity-80',
    solid: 'text-[var(--color-text-primary)] hover:opacity-80',
  },
  divider: {
    overlay:
      'linear-gradient(90deg, transparent 0%, var(--color-text-on-brand) 50%, transparent 100%)',
    solid:
      'linear-gradient(90deg, transparent 0%, var(--color-border-base) 50%, transparent 100%)',
  },
  textAction: {
    overlay: 'text-[var(--color-text-on-brand)] hover:opacity-80',
    solid:
      'text-[var(--color-text-primary)] rounded-[var(--radius-medium)] hover:bg-[var(--color-surface-2)]',
  },
  chromeBorder: {
    overlay: '',
    solid: '',
  },
} as const;

/** Measured chrome fallback until ResizeObserver runs (min-h-56 + vertical padding). */
export const NAVBAR_CHROME_HEIGHT_FALLBACK = 'calc(var(--space-56) + var(--space-4) * 2)';

/** Minimum fixed chrome height — mirrors `--space-64` for JS scroll/fold math. */
export const NAVBAR_CHROME_MIN_HEIGHT = 64;

/** Brand bleed extension below measured chrome — mirrors `--space-2`. */
export const NAVBAR_BRAND_BLEED_EXTRA = 'var(--space-2)';

import {
  bindScrollRoots,
  getScrollRoot,
  getScrollTop,
  readClientHeight,
  readScrollTop,
  scrollRootTo,
} from '../../../hooks/useScrollRoot';

export {
  bindScrollRoots as bindScroll,
  getScrollRoot,
  getScrollTop,
  readClientHeight,
  readScrollTop,
  scrollRootTo,
};

export function lockScrollRoot(lock: boolean): () => void {
  if (typeof document === 'undefined') return () => undefined;

  const root = getScrollRoot();
  if (root === window) {
    const prev = document.body.style.overflow;
    document.body.style.overflow = lock ? 'hidden' : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }

  const el = root as HTMLElement;
  const prev = el.style.overflow;
  el.style.overflow = lock ? 'hidden' : prev;
  return () => {
    el.style.overflow = prev;
  };
}
