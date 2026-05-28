import { useEffect } from 'react';

/**
 * Calls `handler` when Escape key is pressed.
 * Stops propagation so nested overlays close one at a time.
 */
export function useEscapeKey(handler: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handler();
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handler, enabled]);
}
