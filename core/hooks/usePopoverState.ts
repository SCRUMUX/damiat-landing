import { useState, useCallback } from 'react';

export interface UsePopoverStateOptions {
  /** Initial open state (uncontrolled) or controlled via `open` */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Prevent opening */
  disabled?: boolean;
}

export interface UsePopoverStateReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (v: boolean) => void;
}

/**
 * Unified hook for popover open/close state management.
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled (`defaultOpen`) modes.
 * Replaces the duplicated pattern across Dropdown, Autocomplete, and similar components.
 */
export function usePopoverState({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
}: UsePopoverStateOptions = {}): UsePopoverStateReturn {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
  }, [disabled, setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, close, open]);

  return { isOpen, open, close, toggle, setIsOpen };
}
