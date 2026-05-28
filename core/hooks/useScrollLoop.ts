import { useEffect, useRef, type RefObject } from 'react';
import { useScrollLoopContext } from './ScrollLoopContext';
import { useMediaQuery } from './useMediaQuery';
import {
  bindScrollRoots,
  bindWheelRoots,
  getScrollRoot,
  readScrollTop,
  scrollRootTo,
} from './useScrollRoot';

const WRAP_COOLDOWN_MS = 450;
/** Near document top — upward loop only inside this band. */
const UPWARD_EDGE_PX = 20;

export interface UseScrollLoopOptions {
  enabled?: boolean;
  onWrap?: () => void;
}

function measureBridgeLand(segment: HTMLElement): number {
  const bridge = segment.querySelector('[data-scroll-loop-bridge]');
  if (!bridge) {
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    return Math.max(0, segment.offsetHeight - vh);
  }
  return Math.max(
    0,
    bridge.getBoundingClientRect().top - segment.getBoundingClientRect().top,
  );
}

/**
 * Infinite vertical scroll — duplicate segment height.
 * Forward: y >= h → y - h. Upward at top → bridge (not clone hero at y = h).
 */
export function useScrollLoop<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollLoopOptions = {},
): RefObject<T | null> {
  const { enabled = true, onWrap } = options;
  const { setIsWrapping } = useScrollLoopContext();
  const segmentRef = useRef<T | null>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const active = enabled && !prefersReducedMotion;
  const scrollRootRef = useRef<Element | Window>(window);
  const lastScrollYRef = useRef(0);
  const segmentHeightRef = useRef(0);
  const bridgeLandRef = useRef(0);
  const wrappingRef = useRef(false);
  const cooldownUntilRef = useRef(0);
  const measureFrameRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const segment = segmentRef.current;
    if (!segment) return;

    scrollRootRef.current = getScrollRoot();

    const measure = () => {
      if (wrappingRef.current) return;
      segmentHeightRef.current = segment.offsetHeight;
      bridgeLandRef.current = measureBridgeLand(segment);
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(measureFrameRef.current);
      measureFrameRef.current = requestAnimationFrame(measure);
    };

    measure();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(scheduleMeasure)
        : null;
    resizeObserver?.observe(segment);
    window.addEventListener('resize', scheduleMeasure);

    const endWrapping = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          wrappingRef.current = false;
          setIsWrapping(false);
          scheduleMeasure();
        });
      });
    };

    const wrap = (nextY: number) => {
      if (Date.now() < cooldownUntilRef.current) return;

      const root = scrollRootRef.current;
      wrappingRef.current = true;
      setIsWrapping(true);
      scrollRootTo(root, nextY);
      lastScrollYRef.current = readScrollTop(root);
      cooldownUntilRef.current = Date.now() + WRAP_COOLDOWN_MS;
      onWrap?.();
      endWrapping();
    };

    const tryUpwardWrap = (root: Element | Window, y: number): boolean => {
      const landY = bridgeLandRef.current;
      if (landY <= UPWARD_EDGE_PX + 8) return false;
      if (y > UPWARD_EDGE_PX) return false;
      wrap(landY);
      return true;
    };

    let frame = 0;

    const onScroll = () => {
      if (wrappingRef.current) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (Date.now() < cooldownUntilRef.current) {
          lastScrollYRef.current = readScrollTop(scrollRootRef.current);
          return;
        }

        const h = segmentHeightRef.current;
        if (h <= 0) return;

        const root = scrollRootRef.current;
        const y = readScrollTop(root);
        const prevY = lastScrollYRef.current;
        const scrollingUp = y < prevY - 0.5;

        if (scrollingUp && tryUpwardWrap(root, y)) {
          return;
        }

        if (y >= h) {
          wrap(y - h);
          return;
        }

        lastScrollYRef.current = y;
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (wrappingRef.current || Date.now() < cooldownUntilRef.current) return;
      if (event.deltaY >= 0) return;

      const root = scrollRootRef.current;
      const y = readScrollTop(root);
      if (!tryUpwardWrap(root, y)) return;

      event.preventDefault();
    };

    lastScrollYRef.current = readScrollTop(scrollRootRef.current);
    const unbindScroll = bindScrollRoots(onScroll);
    const unbindWheel = bindWheelRoots(onWheel);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(measureFrameRef.current);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      unbindScroll();
      unbindWheel();
      setIsWrapping(false);
    };
  }, [active, onWrap, setIsWrapping]);

  return segmentRef;
}
