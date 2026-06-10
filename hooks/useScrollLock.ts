import { useEffect, useRef } from 'react';

/**
 * Prevent body scrolling while `locked` is true.
 * Restores original overflow on unlock or unmount.
 */
export function useScrollLock(locked: boolean): void {
  const originalRef = useRef<string>('');

  useEffect(() => {
    if (!locked) return;
    originalRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalRef.current;
    };
  }, [locked]);
}
