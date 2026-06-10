import {
  getScrollMetrics,
  subscribeScrollFrame,
} from './useScrollRoot';

type ParallaxEntry = {
  element: HTMLElement;
  factor: number;
};

const entries = new Set<ParallaxEntry>();
let parallaxBusBound = false;

function flushParallaxEntries(): void {
  if (entries.size === 0) return;

  const { clientHeight: viewportHeight } = getScrollMetrics();
  const viewportCenter = viewportHeight / 2;
  const skipMargin = viewportHeight * 1.5;

  for (const { element, factor } of entries) {
    const rect = element.getBoundingClientRect();
    if (rect.bottom < -skipMargin || rect.top > viewportHeight + skipMargin) {
      continue;
    }
    const sectionCenter = rect.top + rect.height / 2;
    const offset = (viewportCenter - sectionCenter) * factor;
    element.style.setProperty('--parallax-offset', `${offset}px`);
  }
}

function ensureParallaxBus(): void {
  if (parallaxBusBound) return;
  parallaxBusBound = true;
  subscribeScrollFrame(flushParallaxEntries);
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', flushParallaxEntries);
  }
}

/** Register an element for batched scroll-linked parallax (single layout pass per frame). */
export function registerParallaxElement(element: HTMLElement, factor: number): () => void {
  const entry = { element, factor };
  entries.add(entry);
  ensureParallaxBus();
  flushParallaxEntries();

  return () => {
    entries.delete(entry);
    element.style.removeProperty('--parallax-offset');
  };
}
