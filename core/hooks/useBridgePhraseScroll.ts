import { useEffect, useRef, useState, type RefObject } from 'react';
import { useScrollLoopContext } from './ScrollLoopContext';

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Picks a phrase index from scroll progress through the bridge section (0..1).
 * Offsets by loopEpoch so each loop cycle starts on a different phrase.
 */
export function useBridgePhraseScroll<T extends HTMLElement = HTMLElement>(
  phrases: readonly string[],
): { ref: RefObject<T | null>; activeIndex: number } {
  const ref = useRef<T | null>(null);
  const { loopEpoch } = useScrollLoopContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const phraseCount = phrases.length;

  useEffect(() => {
    if (phraseCount === 0) return;

    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const update = () => {
      const el = ref.current;
      if (!el || phraseCount === 0) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height + vh;
      const traveled = vh - rect.top;
      const progress = clamp01(traveled / scrollable);
      const scrollSlot = Math.min(
        phraseCount - 1,
        Math.floor(progress * phraseCount),
      );
      const epochOffset = loopEpoch % phraseCount;
      setActiveIndex((scrollSlot + epochOffset) % phraseCount);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [phraseCount, loopEpoch]);

  return { ref, activeIndex };
}
