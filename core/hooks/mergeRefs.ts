import type React from 'react';

type ReactRef<T> = React.Ref<T> | React.RefObject<T | null> | undefined | null;

/**
 * Merges multiple React refs (callback refs, RefObjects, or null) into a single
 * callback ref. Safely handles any combination of ref types.
 *
 * Usage:
 * ```tsx
 * const Component = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
 *   const localRef = useRef<HTMLDivElement>(null);
 *   return <div ref={mergeRefs(ref, localRef)} />;
 * });
 * ```
 */
export function mergeRefs<T>(...refs: ReactRef<T>[]): React.RefCallback<T> {
  return (instance: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(instance);
      } else {
        (ref as React.MutableRefObject<T | null>).current = instance;
      }
    }
  };
}
