import type { RefObject } from 'react';
import { useLoopBridgeScroll } from './useLoopBridgeScroll';

/**
 * @deprecated Use useLoopBridgeScroll — kept for existing imports.
 */
export function useBridgePhraseScroll<T extends HTMLElement = HTMLElement>(
  phrases: readonly string[],
) {
  const { ref, activeIndex } = useLoopBridgeScroll(phrases);
  return { ref: ref as RefObject<T | null>, activeIndex };
}
