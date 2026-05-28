import { useEffect, useRef, useState, type RefObject } from 'react';
import { useScrollLoopContext } from './ScrollLoopContext';
import { useMediaQuery } from './useMediaQuery';

export interface UseScrollDepthRevealOptions {
  /** Skip observer — content stays visible (Storybook controls, tests). */
  disabled?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
}

function isSubstantiallyVisible(node: HTMLElement, minRatio = 0.3): boolean {
  const rect = node.getBoundingClientRect();
  const vh = window.innerHeight;
  const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  if (visibleHeight <= 0 || rect.height <= 0) return false;
  return visibleHeight / Math.min(rect.height, vh) >= minRatio;
}

/**
 * One-shot scroll reveal — flips to visible when the host enters the viewport.
 * Respects `prefers-reduced-motion` (immediate visible).
 * Re-arms after scroll-loop wrap (`loopEpoch`) unless already in view.
 */
export function useScrollDepthReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollDepthRevealOptions = {},
): { ref: RefObject<T | null>; revealed: boolean } {
  const { disabled = false, rootMargin = '0px 0px -10% 0px', threshold = 0.08 } = options;
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { loopEpoch } = useScrollLoopContext();
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

    if (loopEpoch > 0 && isSubstantiallyVisible(node)) {
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
  }, [disabled, prefersReducedMotion, rootMargin, threshold, loopEpoch]);

  return { ref, revealed };
}
