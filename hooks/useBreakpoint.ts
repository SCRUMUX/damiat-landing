import { useState, useEffect, useSyncExternalStore, useCallback } from 'react';
import {
  getCurrentBreakpoint,
  type BreakpointName,
} from '../utils/breakpoint-utils';

let listeners: Array<() => void> = [];
let currentBp: BreakpointName =
  typeof window !== 'undefined' ? getCurrentBreakpoint() : 'desktop';

function subscribe(listener: () => void): () => void {
  listeners = [...listeners, listener];

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function handleResize(): void {
  const next = getCurrentBreakpoint();
  if (next !== currentBp) {
    currentBp = next;
    for (const l of listeners) l();
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize);
}

function getSnapshot(): BreakpointName {
  return currentBp;
}

function getServerSnapshot(): BreakpointName {
  return 'desktop';
}

/**
 * React hook that returns the current responsive breakpoint ('mobile' | 'tablet' | 'desktop').
 * Uses useSyncExternalStore for tear-free reads.
 */
export function useBreakpoint(): BreakpointName {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Returns true when the viewport is at least the given breakpoint.
 */
export function useMinBreakpoint(bp: BreakpointName): boolean {
  const current = useBreakpoint();
  const order: BreakpointName[] = ['mobile', 'tablet', 'desktop'];
  return order.indexOf(current) >= order.indexOf(bp);
}
