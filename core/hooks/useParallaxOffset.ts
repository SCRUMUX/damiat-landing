import { useEffect, useRef } from 'react';
import { useScrollLoopContext } from './ScrollLoopContext';

/**
 * Scroll-linked parallax — sets `--parallax-offset` on the host element (Cortel-style).
 * Pauses updates while scroll-loop is wrapping; rounds px to reduce layout jitter.
 */
export function useParallaxOffset(factor = 0.12, enabled = true) {
  const ref = useRef<HTMLElement | null>(null);
  const { isWrapping } = useScrollLoopContext();

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    const update = () => {
      if (isWrapping) return;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const offset = Math.round((viewportCenter - sectionCenter) * factor);

      el.style.setProperty('--parallax-offset', `${offset}px`);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [enabled, factor, isWrapping]);

  return ref;
}
