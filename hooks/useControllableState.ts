import { useState, useCallback, useRef } from 'react';

interface UseControllableStateParams<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Manages a state value that can be either controlled or uncontrolled.
 * When `value` is provided, the component is controlled.
 * Otherwise it manages its own internal state starting from `defaultValue`.
 */
export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function'
          ? (next as (prev: T) => T)(value)
          : next;

      if (!isControlled) {
        setInternalValue(resolved);
      }
      onChangeRef.current?.(resolved);
    },
    [isControlled, value],
  );

  return [value, setValue];
}
