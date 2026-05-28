/**
 * Unified scroll root — window or Storybook preview container (.sb-show-main, etc.).
 */

const SCROLL_ROOT_IDS = ['storybook-root', 'root'] as const;
const SCROLL_ROOT_SELECTORS = [
  '.sb-show-main',
  '.sb-main-padded',
  '[data-is-storybook="true"]',
] as const;

export function readScrollTop(target: Element | Window): number {
  if (target === window) {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  return (target as HTMLElement).scrollTop || 0;
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

/** Primary scroll container (Storybook iframe inner div when present). */
export function getScrollRoot(): Element | Window {
  for (const root of collectScrollRoots()) {
    if (root === window) continue;
    const el = root as HTMLElement;
    if (el.scrollHeight > el.clientHeight + 1) return root;
  }
  return window;
}

/** Max scroll offset across known roots (navbar fold detection). */
export function getScrollTop(): number {
  let max = 0;
  for (const root of collectScrollRoots()) {
    max = Math.max(max, readScrollTop(root));
  }
  return max;
}

export function scrollRootTo(target: Element | Window, top: number): void {
  const y = Math.round(top);
  if (target === window) {
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    return;
  }
  (target as HTMLElement).scrollTop = y;
}

export function bindScrollRoots(onScroll: () => void): () => void {
  const opts = { passive: true, capture: true } as const;
  const roots = collectScrollRoots();

  for (const root of roots) {
    root.addEventListener('scroll', onScroll, opts);
  }

  return () => {
    for (const root of roots) {
      root.removeEventListener('scroll', onScroll, opts);
    }
  };
}

/** Wheel on the same roots as scroll (loop upward at scroll top). */
export function bindWheelRoots(onWheel: (event: WheelEvent) => void): () => void {
  const opts = { passive: false, capture: true } as const;
  const roots = collectScrollRoots();

  for (const root of roots) {
    root.addEventListener('wheel', onWheel, opts);
  }

  return () => {
    for (const root of roots) {
      root.removeEventListener('wheel', onWheel, opts);
    }
  };
}
