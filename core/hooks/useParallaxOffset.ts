import { useEffect, useRef } from 'react';
import { useScrollLoopContext } from './ScrollLoopContext';
import {
  getScrollRoot,
  readClientHeight,
  subscribeScrollFrame,
} from './useScrollRoot';

/**
 * Scroll-linked parallax — sets `--parallax-offset` on the host element.
 * Uses the primary scroll root bus; pauses while scroll-loop is wrapping.
 */
export function useParallaxOffset(factor = 0.12, enabled = true) {
  const ref = useRef<HTMLElement | null>(null);
  const { isWrapping } = useScrollLoopContext();
  const isWrappingRef = useRef(isWrapping);

  useEffect(() => {
    isWrappingRef.current = isWrapping;
  }, [isWrapping]);

  useEffect(() => {
    if (!enabled || factor === 0) return;

    const update = () => {
      if (isWrappingRef.current) return;

      const el = ref.current;
      if (!el) return;

      const root = getScrollRoot();
      const rect = el.getBoundingClientRect();
      const viewportCenter = readClientHeight(root) / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - sectionCenter) * factor;

      el.style.setProperty('--parallax-offset', `${offset}px`);
    };

    update();
    const unsubscribe = subscribeScrollFrame(update);
    window.addEventListener('resize', update);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', update);
      ref.current?.style.removeProperty('--parallax-offset');
    };
  }, [enabled, factor]);

  return ref;
}
