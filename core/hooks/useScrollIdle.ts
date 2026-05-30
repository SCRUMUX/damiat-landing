import { useEffect, useRef, useState } from 'react';
import { subscribeScrollFrame } from './useScrollRoot';

const IDLE_MS = 140;

/**
 * False while the user is actively scrolling — use to pause hero HUD / heavy animations.
 */
export function useScrollIdle(): boolean {
  const [idle, setIdle] = useState(true);
  const idleTimerRef = useRef(0);
  const scrollingRef = useRef(false);

  useEffect(() => {
    const markScrolling = () => {
      if (!scrollingRef.current) {
        scrollingRef.current = true;
        setIdle(false);
      }
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        scrollingRef.current = false;
        setIdle(true);
      }, IDLE_MS);
    };

    return subscribeScrollFrame(markScrolling);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(idleTimerRef.current);
    },
    [],
  );

  return idle;
}
