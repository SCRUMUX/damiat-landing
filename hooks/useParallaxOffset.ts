import { useEffect, useRef } from 'react';
import { registerParallaxElement } from './parallaxRegistry';

/**
 * Scroll-linked parallax — sets `--parallax-offset` on the host element (batched registry).
 */
export function useParallaxOffset(factor = 0.12, enabled = true) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || factor === 0) return;

    const el = ref.current;
    if (!el) return undefined;

    return registerParallaxElement(el, factor);
  }, [enabled, factor]);

  return ref;
}
