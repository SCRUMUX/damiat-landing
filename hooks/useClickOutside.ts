import { useEffect, type RefObject } from 'react';

/**
 * Calls `handler` when a click occurs outside all provided refs.
 * Attaches on mousedown for reliable detection before focus shifts.
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const targets = Array.isArray(refs) ? refs : [refs];

    const onMouseDown = (e: MouseEvent) => {
      const inside = targets.some(
        (r) => r.current && r.current.contains(e.target as Node),
      );
      if (!inside) handler();
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [refs, handler, enabled]);
}
