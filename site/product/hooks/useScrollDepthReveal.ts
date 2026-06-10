import { useEffect, useRef, useState, type RefObject } from 'react';
import { useMediaQuery } from '@ai-ds/core/hooks/useMediaQuery';

export interface UseScrollDepthRevealOptions {
  /** Skip observer — content stays visible (Storybook controls, tests). */
  disabled?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * One-shot scroll reveal — flips to visible when the host enters the viewport.
 * Respects `prefers-reduced-motion` (immediate visible).
 */
export function useScrollDepthReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollDepthRevealOptions = {},
): { ref: RefObject<T | null>; revealed: boolean } {
  const { disabled = false, rootMargin = '0px 0px -10% 0px', threshold = 0.08 } = options;
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(() => disabled || prefersReducedMotion);

  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    setRevealed(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, prefersReducedMotion, rootMargin, threshold]);

  return { ref, revealed };
}
