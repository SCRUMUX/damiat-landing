import { useState, useCallback, useEffect } from 'react';

/**
 * Persist a value in localStorage with automatic JSON serialization.
 * Falls back to `initialValue` when storage is unavailable or empty.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = globalThis.localStorage?.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          globalThis.localStorage?.setItem(key, JSON.stringify(next));
        } catch { /* quota exceeded or SSR */ }
        return next;
      });
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setStored(e.newValue !== null ? JSON.parse(e.newValue) : initialValue);
      } catch { /* ignore */ }
    };
    globalThis.addEventListener?.('storage', onStorage);
    return () => globalThis.removeEventListener?.('storage', onStorage);
  }, [key, initialValue]);

  return [stored, setValue];
}
