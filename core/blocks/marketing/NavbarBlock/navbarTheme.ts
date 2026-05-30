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

/** Scroll-perf solid chrome — glass frost (same as default solid header). */
export const NAVBAR_SOLID_PERF_CLASS = cn(
  'backdrop-blur-background',
  'bg-[color-mix(in_srgb,var(--color-surface-1)_68%,transparent)]',
  'shadow-elevation-1',
  'border-b border-[var(--color-border-base)]/40',
);

/** Scroll-perf hero glass — backdrop blur retained while scrolling. */
export const NAVBAR_STATIC_GLASS_PERF_CLASS = NAVBAR_STATIC_GLASS_HEADER_CLASS;

/** Scroll-perf overlay — glass on brand hero. */
export const NAVBAR_OVERLAY_PERF_CLASS = BLOCK_GLASS_CHROME_NAVBAR_OVERLAY_CLASS;

/** Desktop nav typography (768+ menu, 1024+ actions). */
export const NAVBAR_LINK_TYPE = 'text-style-body-lg font-normal';

export const NAVBAR_ACTION_TYPE = 'text-style-body-lg font-normal';

export const NAVBAR_LOGO_TYPE = cn('text-style-h3 font-semibold min-[1024px]:text-style-h2');

const NAVBAR_TEXT = {
  overlay: 'text-[var(--color-text-on-brand)]',
  solid: 'text-[var(--color-text-primary)]',
} as const;

/** Ghost-button hover — text/icon → brand, без подложки. */
const NAVBAR_INTERACTIVE = cn(
  'rounded-[var(--radius-medium)] no-underline',
  'transition-colors duration-150',
);

export const NAVBAR_HOVER_TEXT = {
  overlay: 'hover:text-[var(--color-brand-hover)]',
  solid: 'hover:text-[var(--color-brand-primary)]',
} as const;

function navInteractive(surface: NavbarSurface, padding: string): string {
  return cn(NAVBAR_INTERACTIVE, NAVBAR_TEXT[surface], padding, NAVBAR_HOVER_TEXT[surface]);
}

export const NAVBAR_SURFACE = {
  header: {
    overlay: BLOCK_GLASS_CHROME_NAVBAR_OVERLAY_CLASS,
    solid: BLOCK_GLASS_CHROME_NAVBAR_SOLID_CLASS,
    staticGlass: NAVBAR_STATIC_GLASS_HEADER_CLASS,
  },
  text: NAVBAR_TEXT,
  socialRail: {
    overlay: 'bg-transparent text-[var(--color-text-on-brand)]',
    solid: 'bg-transparent text-[var(--color-text-primary)]',
  },
  socialIcon: {
    overlay: navInteractive('overlay', 'p-[var(--space-2)]'),
    solid: navInteractive('solid', 'p-[var(--space-2)]'),
  },
  divider: {
    overlay:
      'linear-gradient(90deg, transparent 0%, var(--color-text-on-brand) 50%, transparent 100%)',
    solid:
      'linear-gradient(90deg, transparent 0%, var(--color-border-base) 50%, transparent 100%)',
  },
  textAction: {
    overlay: navInteractive('overlay', 'px-[var(--space-3)] py-[var(--space-2)]'),
    solid: navInteractive('solid', 'px-[var(--space-3)] py-[var(--space-2)]'),
  },
  navLink: {
    overlay: navInteractive('overlay', 'px-[var(--space-2)] py-[var(--space-1)]'),
    solid: navInteractive('solid', 'px-[var(--space-2)] py-[var(--space-1)]'),
  },
  phoneLink: {
    overlay: navInteractive('overlay', 'px-[var(--space-2)] py-[var(--space-1)]'),
    solid: navInteractive('solid', 'px-[var(--space-2)] py-[var(--space-1)]'),
  },
  logoLink: {
    overlay: navInteractive('overlay', 'px-[var(--space-1)] py-[var(--space-1)]'),
    solid: navInteractive('solid', 'px-[var(--space-1)] py-[var(--space-1)]'),
  },
  chromeBorder: {
    overlay: '',
    solid: '',
  },
} as const;

export function resolveNavbarHeaderClass(
  headerSurface: 'overlay' | 'solid' | 'staticGlass',
  scrollPerf = false,
): string {
  if (!scrollPerf) {
    return NAVBAR_SURFACE.header[headerSurface];
  }
  if (headerSurface === 'staticGlass') return NAVBAR_STATIC_GLASS_PERF_CLASS;
  if (headerSurface === 'overlay') return NAVBAR_OVERLAY_PERF_CLASS;
  return NAVBAR_SOLID_PERF_CLASS;
}

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

/** Pinned target while a modal/menu holds scroll — avoids unlock on a different root. */
let pinnedScrollLock: {
  root: Element | Window;
  bodyOverflow: string;
  elementOverflow: string | null;
} | null = null;

export function lockScrollRoot(lock: boolean): () => void {
  if (typeof document === 'undefined') return () => undefined;

  if (!lock) {
    if (!pinnedScrollLock) return () => undefined;
    const { root, bodyOverflow, elementOverflow } = pinnedScrollLock;
    pinnedScrollLock = null;
    document.body.style.overflow = bodyOverflow;
    if (root !== window && elementOverflow !== null) {
      (root as HTMLElement).style.overflow = elementOverflow;
    }
    return () => undefined;
  }

  if (pinnedScrollLock) {
    return () => lockScrollRoot(false);
  }

  const root = getScrollRoot();
  const bodyOverflow = document.body.style.overflow;
  const elementOverflow = root === window ? null : (root as HTMLElement).style.overflow;

  pinnedScrollLock = { root, bodyOverflow, elementOverflow };

  if (root === window) {
    document.body.style.overflow = 'hidden';
  } else {
    (root as HTMLElement).style.overflow = 'hidden';
  }

  return () => lockScrollRoot(false);
}
