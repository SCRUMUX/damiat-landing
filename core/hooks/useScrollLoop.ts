import { useEffect, useRef, type RefObject } from 'react';
import { useScrollLoopContext } from './ScrollLoopContext';
import { useMediaQuery } from './useMediaQuery';
import {
  bindPrimaryScrollRoot,
  getScrollRoot,
  getSegmentScrollLayout,
  readClientHeight,
  readScrollTop,
  scrollRootTo,
  type SegmentScrollLayout,
} from './useScrollRoot';

const WRAP_COOLDOWN_MS = 450;
const UPWARD_SUPPRESS_MS = 700;
const UPWARD_TOP_PX = 2;
const WHEEL_UP_ACCUM_PX = 52;
const FORWARD_END_SLACK_PX = 24;
const SCROLL_DIR_PX = 2;
/** With bridge: wrap only after scrolling this far into the clone segment (past clone hero). */
const CLONE_DEPTH_RATIO = 0.92;

export interface UseScrollLoopOptions {
  enabled?: boolean;
  onWrap?: () => void;
}

function segmentHasBridge(segment: HTMLElement): boolean {
  return Boolean(segment.querySelector('[data-scroll-loop-bridge]'));
}

function measureBridgeLand(
  segment: HTMLElement,
  layout: SegmentScrollLayout,
  root: Element | Window,
): number {
  const bridge = segment.querySelector('[data-scroll-loop-bridge]') as HTMLElement | null;
  if (!bridge) {
    return layout.endScrollY;
  }

  const scrollY = readScrollTop(root);
  const segRect = segment.getBoundingClientRect();
  const bridgeRect = bridge.getBoundingClientRect();
  const bridgeTop = scrollY + bridgeRect.top - segRect.top;

  return bridgeTop + Math.min(bridgeRect.height * 0.12, readClientHeight(root) * 0.08);
}

function forwardWrapThreshold(
  segment: HTMLElement,
  layout: SegmentScrollLayout,
  root: Element | Window,
  hasBridge: boolean,
): number {
  if (!hasBridge) {
    return layout.cloneStartScrollY - FORWARD_END_SLACK_PX;
  }

  const clientH = readClientHeight(root);
  return layout.cloneStartScrollY + clientH * CLONE_DEPTH_RATIO;
}

function isFullCycleTarget(nextY: number, layout: SegmentScrollLayout): boolean {
  return Math.abs(nextY - layout.top) <= FORWARD_END_SLACK_PX;
}

/**
 * Infinite vertical scroll — duplicate segment; bridge defers endScrollY wrap; deep clone wrap.
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
  const layoutRef = useRef<SegmentScrollLayout | null>(null);
  const bridgeLandRef = useRef(0);
  const forwardThresholdRef = useRef(0);
  const hasBridgeRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const wrappingRef = useRef(false);
  const cooldownUntilRef = useRef(0);
  const upwardSuppressUntilRef = useRef(0);
  const wheelUpAccumRef = useRef(0);
  const measureFrameRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const segment = segmentRef.current;
    if (!segment) return;

    scrollRootRef.current = getScrollRoot();
    lastScrollYRef.current = readScrollTop(scrollRootRef.current);
    hasBridgeRef.current = segmentHasBridge(segment);

    const measure = () => {
      if (wrappingRef.current) return;
      const root = scrollRootRef.current;
      const layout = getSegmentScrollLayout(segment, root);
      layoutRef.current = layout;
      hasBridgeRef.current = segmentHasBridge(segment);
      bridgeLandRef.current = measureBridgeLand(segment, layout, root);
      forwardThresholdRef.current = forwardWrapThreshold(
        segment,
        layout,
        root,
        hasBridgeRef.current,
      );
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
        wrappingRef.current = false;
        setIsWrapping(false);
        scheduleMeasure();
      });
    };

    const wrap = (nextY: number, bumpEpoch: boolean) => {
      if (Date.now() < cooldownUntilRef.current) return;

      const root = scrollRootRef.current;
      const layout = layoutRef.current;
      const currentY = readScrollTop(root);

      if (Math.abs(currentY - nextY) < 4) return;

      wrappingRef.current = true;
      setIsWrapping(true);
      scrollRootTo(root, nextY);
      lastScrollYRef.current = readScrollTop(root);
      cooldownUntilRef.current = Date.now() + WRAP_COOLDOWN_MS;

      if (layout && nextY <= layout.top + FORWARD_END_SLACK_PX) {
        upwardSuppressUntilRef.current = Date.now() + UPWARD_SUPPRESS_MS;
      }

      wheelUpAccumRef.current = 0;
      if (bumpEpoch) onWrap?.();
      endWrapping();
    };

    const tryForwardWrap = (y: number, scrollingDown: boolean): boolean => {
      const layout = layoutRef.current;
      if (!layout || layout.height <= 0 || !scrollingDown) return false;

      const threshold = forwardThresholdRef.current;

      if (y >= threshold) {
        const nextY = y - layout.height;
        const bumpEpoch =
          hasBridgeRef.current || isFullCycleTarget(nextY, layout);
        wrap(nextY, bumpEpoch);
        return true;
      }

      if (hasBridgeRef.current) {
        return false;
      }

      const clientH = readClientHeight(scrollRootRef.current);
      if (
        layout.height > clientH + 80 &&
        y >= layout.endScrollY - FORWARD_END_SLACK_PX &&
        y < layout.cloneStartScrollY - FORWARD_END_SLACK_PX
      ) {
        wrap(layout.top, true);
        return true;
      }

      return false;
    };

    const tryUpwardWrap = (y: number): boolean => {
      if (Date.now() < upwardSuppressUntilRef.current) return false;

      const layout = layoutRef.current;
      if (!layout || y > layout.top + UPWARD_TOP_PX) return false;

      const landY = hasBridgeRef.current ? bridgeLandRef.current : layout.endScrollY;
      if (landY <= layout.top + 80) return false;

      wrap(landY, false);
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

        const layout = layoutRef.current;
        if (!layout || layout.height <= 0) return;

        const root = scrollRootRef.current;
        const y = readScrollTop(root);
        const prevY = lastScrollYRef.current;
        const scrollingDown = y > prevY + SCROLL_DIR_PX;

        if (tryForwardWrap(y, scrollingDown)) {
          return;
        }

        if (y > layout.top + UPWARD_TOP_PX) {
          wheelUpAccumRef.current = 0;
        }

        lastScrollYRef.current = y;
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (wrappingRef.current || Date.now() < cooldownUntilRef.current) return;

      const root = scrollRootRef.current;
      const layout = layoutRef.current;
      const y = readScrollTop(root);

      if (!layout) return;

      if (y > layout.top + UPWARD_TOP_PX) {
        wheelUpAccumRef.current = 0;
        return;
      }

      if (event.deltaY > 0) {
        wheelUpAccumRef.current = 0;
        return;
      }

      wheelUpAccumRef.current += event.deltaY;
      if (wheelUpAccumRef.current > -WHEEL_UP_ACCUM_PX) return;

      if (!tryUpwardWrap(y)) return;

      event.preventDefault();
      wheelUpAccumRef.current = 0;
    };

    const unbind = bindPrimaryScrollRoot(onScroll, onWheel);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(measureFrameRef.current);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      unbind();
      setIsWrapping(false);
    };
  }, [active, onWrap, setIsWrapping]);

  return segmentRef;
}
