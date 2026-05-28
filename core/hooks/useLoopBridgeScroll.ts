import type { RefObject } from 'react';
import { useLoopSeamScroll, type UseLoopSeamScrollResult } from './useLoopSeamScroll';

/**
 * @deprecated Use useLoopSeamScroll — kept for ScrollLoopBridge compatibility.
 */
export function useLoopBridgeScroll<T extends HTMLElement = HTMLElement>(
  phrases: readonly string[],
): { ref: RefObject<T | null>; activeIndex: number; progress: number } {
  const result = useLoopSeamScroll(phrases, true);
  return {
    ref: result.ref as RefObject<T | null>,
    activeIndex: result.activeIndex,
    progress: result.progress,
  };
}

export type { UseLoopSeamScrollResult };
