import { useState, useEffect } from 'react';

/**
 * Track a CSS media query. Returns `true` when the query matches.
 *
 * @example useMediaQuery('(max-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof globalThis.matchMedia !== 'function') return false;
    return globalThis.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof globalThis.matchMedia !== 'function') return;
    const mql = globalThis.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
