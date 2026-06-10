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
  /** @deprecated Scroll-loop only — clone zone start; unused on linear landings. */
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

function scrollRange(root: Element | Window): number {
  if (root === window) {
    return Math.max(0, document.documentElement.scrollHeight - readClientHeight(window));
  }
  const el = root as HTMLElement;
  return Math.max(0, el.scrollHeight - el.clientHeight);
}

let cachedScrollRoot: Element | Window | null = null;

/** Invalidate after resize / layout changes (Storybook viewport, etc.). */
export function invalidateScrollRootCache(): void {
  cachedScrollRoot = null;
}

function isActiveScrollport(root: Element | Window): boolean {
  if (root === window) {
    return scrollRange(window) > 1;
  }
  const el = root as HTMLElement;
  if (!el.isConnected || el.scrollHeight <= el.clientHeight + 1) {
    return false;
  }
  const { overflowY } = getComputedStyle(el);
  return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
}

/** Pick the element that actually scrolls — not the one with the largest scrollHeight. */
function detectScrollRoot(): Element | Window {
  for (const selector of SCROLL_ROOT_SELECTORS) {
    const matches = document.querySelectorAll<HTMLElement>(selector);
    for (const el of matches) {
      if (isActiveScrollport(el)) {
        return el;
      }
    }
  }

  for (const id of SCROLL_ROOT_IDS) {
    const el = document.getElementById(id);
    if (el && isActiveScrollport(el)) {
      return el;
    }
  }

  return window;
}

function rebindScrollFrameIfNeeded(): void {
  if (!scrollFrameBound || !scrollFrameListeners || scrollFrameListeners.size === 0) {
    return;
  }

  const root = detectScrollRoot();
  if (boundScrollRoot === root) {
    return;
  }

  const opts = { passive: true, capture: true } as const;
  if (boundScrollRoot) {
    boundScrollRoot.removeEventListener('scroll', scheduleScrollFrame, opts);
  }
  boundScrollRoot = root;
  root.addEventListener('scroll', scheduleScrollFrame, opts);
}

/** Primary scroll container — re-validates when Storybook toggles canvas fullscreen. */
export function getScrollRoot(): Element | Window {
  const resolved = detectScrollRoot();
  if (cachedScrollRoot !== resolved) {
    cachedScrollRoot = resolved;
    rebindScrollFrameIfNeeded();
  }
  return resolved;
}

/** Reused inside one rAF flush so listeners share one root lookup. */
let frameScrollRoot: Element | Window | null = null;

function getScrollRootForFrame(): Element | Window {
  return frameScrollRoot ?? getScrollRoot();
}

export function getScrollTop(): number {
  return readScrollTop(getScrollRootForFrame());
}

/** Scroll metrics for navbar / parallax — one root read per call site. */
export function getScrollMetrics(): {
  root: Element | Window;
  scrollTop: number;
  clientHeight: number;
} {
  const root = getScrollRootForFrame();
  return {
    root,
    scrollTop: readScrollTop(root),
    clientHeight: readClientHeight(root),
  };
}

export function scrollRootTo(_target: Element | Window, top: number): void {
  invalidateScrollRootCache();
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
let boundScrollRoot: Element | Window | null = null;

function flushScrollFrame(): void {
  scrollFrameId = 0;
  frameScrollRoot = getScrollRoot();
  if (!scrollFrameListeners) {
    frameScrollRoot = null;
    return;
  }
  for (const listener of scrollFrameListeners) {
    listener();
  }
  frameScrollRoot = null;
}

function scheduleScrollFrame(): void {
  if (scrollFrameId) return;
  scrollFrameId = requestAnimationFrame(flushScrollFrame);
}

function unbindScrollFrameIfEmpty(): void {
  if (scrollFrameListeners && scrollFrameListeners.size > 0) return;
  if (!scrollFrameBound || !boundScrollRoot) return;
  const opts = { passive: true, capture: true } as const;
  boundScrollRoot.removeEventListener('scroll', scheduleScrollFrame, opts);
  scrollFrameBound = false;
  boundScrollRoot = null;
}

/** One scroll listener on the primary root — shared rAF bus for parallax / navbar. */
export function subscribeScrollFrame(listener: ScrollFrameListener): () => void {
  if (!scrollFrameListeners) {
    scrollFrameListeners = new Set();
  }

  scrollFrameListeners.add(listener);

  if (!scrollFrameBound) {
    scrollFrameBound = true;
    invalidateScrollRootCache();
    boundScrollRoot = getScrollRoot();
    const opts = { passive: true, capture: true } as const;
    boundScrollRoot.addEventListener('scroll', scheduleScrollFrame, opts);
  }

  return () => {
    scrollFrameListeners?.delete(listener);
    unbindScrollFrameIfEmpty();
  };
}

/** Listen only on the primary scroll root. */
export function bindPrimaryScrollRoot(
  onScroll: () => void,
  onWheel?: (event: WheelEvent) => void,
): () => void {
  invalidateScrollRootCache();
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

if (typeof window !== 'undefined') {
  const invalidate = () => {
    invalidateScrollRootCache();
    rebindScrollFrameIfNeeded();
  };
  window.addEventListener('resize', invalidate, { passive: true });
  document.addEventListener('fullscreenchange', invalidate);
  // Re-detect scroll root after first layout (landing images, Storybook canvas).
  requestAnimationFrame(() => {
    requestAnimationFrame(invalidate);
  });
}
