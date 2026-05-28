/**
 * Unified scroll root — window or Storybook preview container (.sb-show-main, etc.).
 */

const SCROLL_ROOT_IDS = ['storybook-root', 'root'] as const;
const SCROLL_ROOT_SELECTORS = [
  '.sb-show-main',
  '.sb-main-padded',
  '[data-is-storybook="true"]',
] as const;

export interface SegmentScrollLayout {
  /** Scroll offset where the segment starts in the primary root. */
  top: number;
  height: number;
  /** scrollTop when the segment bottom meets the viewport bottom. */
  endScrollY: number;
  /** scrollTop when the duplicate (clone) zone begins. */
  cloneStartScrollY: number;
}

export function readScrollTop(target: Element | Window): number {
  if (target === window) {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  return (target as HTMLElement).scrollTop || 0;
}

export function readClientHeight(target: Element | Window): number {
  if (target === window) {
    return window.innerHeight || document.documentElement.clientHeight || 800;
  }
  return (target as HTMLElement).clientHeight || 0;
}

function collectScrollRoots(): (Element | Window)[] {
  if (typeof document === 'undefined') return [window];

  const roots: (Element | Window)[] = [window, document.documentElement, document.body];

  for (const id of SCROLL_ROOT_IDS) {
    const el = document.getElementById(id);
    if (el) roots.push(el);
  }

  for (const selector of SCROLL_ROOT_SELECTORS) {
    document.querySelectorAll(selector).forEach((el) => roots.push(el));
  }

  return roots;
}

function scrollRange(root: Element | Window): number {
  if (root === window) {
    return Math.max(0, document.documentElement.scrollHeight - readClientHeight(window));
  }
  const el = root as HTMLElement;
  return Math.max(0, el.scrollHeight - el.clientHeight);
}

/** Primary scroll container — the one with the largest scrollable range. */
export function getScrollRoot(): Element | Window {
  let best: Element | Window = window;
  let bestRange = scrollRange(window);

  for (const root of collectScrollRoots()) {
    if (root === window) continue;
    const range = scrollRange(root);
    if (range > bestRange) {
      bestRange = range;
      best = root;
    }
  }

  return best;
}

export function getScrollTop(): number {
  return readScrollTop(getScrollRoot());
}

export function scrollRootTo(target: Element | Window, top: number): void {
  const y = Math.max(0, Math.round(top));
  const primary = getScrollRoot();

  if (primary === window) {
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    return;
  }

  (primary as HTMLElement).scrollTop = y;

  const winMax = Math.max(0, document.documentElement.scrollHeight - readClientHeight(window));
  if (y <= winMax + 1 && Math.abs(readScrollTop(window) - y) > 4) {
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  }
}

/** Segment geometry in primary-root scroll coordinates. */
export function getSegmentScrollLayout(
  segment: HTMLElement,
  root: Element | Window = getScrollRoot(),
): SegmentScrollLayout {
  const height = segment.offsetHeight;
  const clientH = readClientHeight(root);
  const y = readScrollTop(root);
  const segRect = segment.getBoundingClientRect();

  let top: number;
  if (root === window) {
    top = segRect.top + y;
  } else {
    const rootRect = (root as HTMLElement).getBoundingClientRect();
    top = y + segRect.top - rootRect.top;
  }

  const endScrollY =
    height > clientH + 48
      ? top + height - clientH
      : top + height - 8;
  const cloneStartScrollY = top + height;

  return { top, height, endScrollY, cloneStartScrollY };
}

type ScrollFrameListener = () => void;

let scrollFrameListeners: Set<ScrollFrameListener> | null = null;
let scrollFrameBound = false;
let scrollFrameId = 0;

function flushScrollFrame(): void {
  scrollFrameId = 0;
  if (!scrollFrameListeners) return;
  for (const listener of scrollFrameListeners) {
    listener();
  }
}

function scheduleScrollFrame(): void {
  if (scrollFrameId) return;
  scrollFrameId = requestAnimationFrame(flushScrollFrame);
}

/** One scroll listener on the primary root — shared rAF bus for loop / parallax / bridge. */
export function subscribeScrollFrame(listener: ScrollFrameListener): () => void {
  if (!scrollFrameListeners) {
    scrollFrameListeners = new Set();
  }

  scrollFrameListeners.add(listener);

  if (!scrollFrameBound) {
    scrollFrameBound = true;
    const root = getScrollRoot();
    const opts = { passive: true, capture: true } as const;
    root.addEventListener('scroll', scheduleScrollFrame, opts);
  }

  return () => {
    scrollFrameListeners?.delete(listener);
  };
}

/** Listen only on the primary scroll root. */
export function bindPrimaryScrollRoot(
  onScroll: () => void,
  onWheel?: (event: WheelEvent) => void,
): () => void {
  const root = getScrollRoot();
  const scrollOpts = { passive: true, capture: true } as const;
  const wheelOpts = { passive: false, capture: true } as const;

  root.addEventListener('scroll', onScroll, scrollOpts);
  if (onWheel) {
    root.addEventListener('wheel', onWheel, wheelOpts);
  }

  return () => {
    root.removeEventListener('scroll', onScroll, scrollOpts);
    if (onWheel) {
      root.removeEventListener('wheel', onWheel, wheelOpts);
    }
  };
}

/** @deprecated Prefer subscribeScrollFrame. */
export function bindScrollRoots(onScroll: () => void): () => void {
  return bindPrimaryScrollRoot(onScroll);
}

/** @deprecated Prefer bindPrimaryScrollRoot with onWheel. */
export function bindWheelRoots(onWheel: (event: WheelEvent) => void): () => void {
  return bindPrimaryScrollRoot(() => {}, onWheel);
}
