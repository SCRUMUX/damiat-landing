import { useEffect, useRef, useState, type RefObject } from 'react';

export interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

/**
 * Observe an element's visibility via IntersectionObserver.
 * Returns [ref, isIntersecting, entry].
 *
 * Set `once: true` to disconnect after the first intersection
 * (useful for lazy-load / reveal animations).
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {},
): [RefObject<T | null>, boolean, IntersectionObserverEntry | null] {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const { root = null, rootMargin = '0px', threshold = 0, once = false } = options;

    const observer = new IntersectionObserver(
      ([e]) => {
        setIsIntersecting(e.isIntersecting);
        setEntry(e);
        if (once && e.isIntersecting) observer.disconnect();
      },
      { root, rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold, options.once]);

  return [ref, isIntersecting, entry];
}
