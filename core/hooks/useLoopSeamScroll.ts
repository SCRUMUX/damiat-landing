import { useEffect, useRef, useState, type RefObject } from 'react';
import { useScrollLoopContext } from './ScrollLoopContext';
import { getScrollRoot, readClientHeight, readScrollTop, subscribeScrollFrame } from './useScrollRoot';

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export interface UseLoopSeamScrollResult {
  ref: RefObject<HTMLDivElement | null>;
  activeIndex: number;
  progress: number;
  open: number;
}

/**
 * Scroll progress from runway — drives fixed bg opacity and footer/hero gate shifts.
 */
export function useLoopSeamScroll(
  phrases: readonly string[],
  enabled = true,
): UseLoopSeamScrollResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const { loopEpoch, isWrapping } = useScrollLoopContext();
  const loopEpochRef = useRef(loopEpoch);
  const isWrappingRef = useRef(isWrapping);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(0);
  const lastIndexRef = useRef(0);
  const lastProgressRef = useRef(-1);
  const lastOpenRef = useRef(-1);
  const phraseCount = phrases.length;

  useEffect(() => {
    loopEpochRef.current = loopEpoch;
  }, [loopEpoch]);

  useEffect(() => {
    isWrappingRef.current = isWrapping;
  }, [isWrapping]);

  useEffect(() => {
    if (!enabled || phraseCount === 0) return;

    const applyVars = (vars: Record<string, string>) => {
      document.documentElement.style.setProperty('--seam-mounted', '1');
      for (const [key, value] of Object.entries(vars)) {
        document.documentElement.style.setProperty(key, value);
      }
      const node = ref.current;
      if (node) {
        for (const [key, value] of Object.entries(vars)) {
          node.style.setProperty(key, value);
        }
      }
    };

    const clearVars = (keys: string[]) => {
      document.documentElement.style.removeProperty('--seam-mounted');
      for (const key of keys) {
        document.documentElement.style.removeProperty(key);
        ref.current?.style.removeProperty(key);
      }
    };

    const update = () => {
      const el = ref.current;
      const runway = el?.querySelector('[data-loop-seam-runway]') as HTMLElement | null;
      if (!el || !runway) return;

      const root = getScrollRoot();
      const vh = readClientHeight(root);
      const scrollY = readScrollTop(root);
      const runwayRect = runway.getBoundingClientRect();
      const inRunway = runwayRect.bottom > 0 && runwayRect.top < vh;

      const footer = document.querySelector(
        '[data-scroll-loop-segment="live"] [data-loop-seam-footer]',
      ) as HTMLElement | null;
      const hero = document.querySelector(
        '[data-scroll-loop-segment="clone"] [data-loop-seam-hero]',
      ) as HTMLElement | null;

      let gateRaw = 0;
      if (footer && hero) {
        const gap = hero.getBoundingClientRect().top - footer.getBoundingClientRect().bottom;
        gateRaw = clamp01(gap / Math.max(vh * 0.55, 280));
      }

      const runwayRaw = inRunway
        ? clamp01((vh - runwayRect.top) / (runwayRect.height + vh * 0.25))
        : 0;

      const raw = Math.max(runwayRaw, gateRaw);
      const openVal = easeOutCubic(clamp01(raw / 0.88));
      const phraseReveal = clamp01((raw - 0.08) / 0.75);
      const shiftVh = openVal * 48;
      const bgOpacity = inRunway ? clamp01(openVal * 1.05) : 0;

      if (!isWrappingRef.current) {
        if (Math.abs(raw - lastProgressRef.current) > 0.004) {
          lastProgressRef.current = raw;
          setProgress(raw);
        }
        if (Math.abs(openVal - lastOpenRef.current) > 0.004) {
          lastOpenRef.current = openVal;
          setOpen(openVal);
        }

        const scrollSlot = Math.min(phraseCount - 1, Math.floor(raw * phraseCount));
        const epochOffset = loopEpochRef.current % phraseCount;
        const nextIndex = (scrollSlot + epochOffset) % phraseCount;
        if (nextIndex !== lastIndexRef.current) {
          lastIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
        }
      }

      applyVars({
        '--seam-progress': raw.toFixed(4),
        '--seam-open': openVal.toFixed(4),
        '--seam-active': bgOpacity > 0.04 ? '1' : '0',
        '--seam-bg-opacity': bgOpacity.toFixed(4),
        '--seam-phrase-reveal': Math.max(phraseReveal, openVal * 0.55).toFixed(4),
        '--seam-logo-scale': (0.9 + 0.1 * openVal).toFixed(4),
        '--seam-footer-y': `${shiftVh}vh`,
        '--seam-hero-y': `${-shiftVh}vh`,
        '--seam-runway-scroll-y': `${Math.round(scrollY + runwayRect.top).toFixed(0)}`,
        '--bridge-progress': raw.toFixed(4),
        '--bridge-open': openVal.toFixed(4),
      });
    };

    update();
    const unsubscribe = subscribeScrollFrame(update);
    window.addEventListener('resize', update);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', update);
      clearVars([
        '--seam-progress',
        '--seam-open',
        '--seam-active',
        '--seam-bg-opacity',
        '--seam-phrase-reveal',
        '--seam-logo-scale',
        '--seam-footer-y',
        '--seam-hero-y',
        '--seam-runway-scroll-y',
        '--bridge-progress',
        '--bridge-open',
      ]);
    };
  }, [enabled, phraseCount]);

  return { ref, activeIndex, progress, open };
}
