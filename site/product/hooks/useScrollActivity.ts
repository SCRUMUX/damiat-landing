import { useEffect } from 'react';
import { getScrollRoot, invalidateScrollRootCache } from './useScrollRoot';

const SCROLL_ATTR = 'data-user-scrolling';
const ROOT_WINDOW_ATTR = 'data-scroll-root-window';
/** Marks active DAMIAT landing — avoids expensive :has() in scroll CSS. */
export const LANDING_ACTIVE_ATTR = 'data-damiat-landing-active';
/** Idle before removing scroll perf chrome — longer than rAF jank window. */
const IDLE_MS = 280;

const SCROLL_LISTENER_OPTS = { passive: true, capture: true } as const;

function syncScrollRootMode(landingActive: boolean): void {
  invalidateScrollRootCache();
  const onWindow = getScrollRoot() === window;
  document.documentElement.toggleAttribute(ROOT_WINDOW_ATTR, onWindow);
  document.documentElement.toggleAttribute(LANDING_ACTIVE_ATTR, landingActive);
}

function bindScrollListener(
  target: Element | Window,
  handler: () => void,
): () => void {
  target.addEventListener('scroll', handler, SCROLL_LISTENER_OPTS);
  return () => target.removeEventListener('scroll', handler, SCROLL_LISTENER_OPTS);
}

/**
 * Marks `<html data-user-scrolling>` while the user scrolls — no React state.
 * Listens only on the primary scroll root (not document capture) so nested
 * overflow panels do not thrash global perf CSS.
 */
export function useScrollActivity(enabled = true): void {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined;

    let idleTimer = 0;
    let scrolling = false;
    let unbindScroll: (() => void) | null = null;

    const markScrolling = () => {
      if (!scrolling) {
        scrolling = true;
        document.documentElement.setAttribute(SCROLL_ATTR, '');
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        scrolling = false;
        document.documentElement.removeAttribute(SCROLL_ATTR);
      }, IDLE_MS);
    };

    const rebind = () => {
      unbindScroll?.();
      unbindScroll = null;
      syncScrollRootMode(true);
      const root = getScrollRoot();
      unbindScroll = bindScrollListener(root, markScrolling);
    };

    rebind();
    window.addEventListener('resize', rebind, { passive: true });
    document.addEventListener('fullscreenchange', rebind);

    const layoutFrame = requestAnimationFrame(() => {
      requestAnimationFrame(rebind);
    });

    return () => {
      cancelAnimationFrame(layoutFrame);
      unbindScroll?.();
      window.removeEventListener('resize', rebind);
      document.removeEventListener('fullscreenchange', rebind);
      window.clearTimeout(idleTimer);
      document.documentElement.removeAttribute(SCROLL_ATTR);
      document.documentElement.removeAttribute(ROOT_WINDOW_ATTR);
      document.documentElement.removeAttribute(LANDING_ACTIVE_ATTR);
    };
  }, [enabled]);
}
