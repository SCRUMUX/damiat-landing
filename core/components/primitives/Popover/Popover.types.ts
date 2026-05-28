import React from 'react';

export interface PopoverProps {
  /**
   * Legacy: ref to the anchor element used for positioning detection.
   * Since AICADS Popover is now backed by Radix Popover + Floating UI, the
   * anchor is determined automatically by the nearest positioned ancestor
   * (via an invisible `Radix.Anchor` spanning `absolute inset-0`).
   * This prop is preserved for source-compatibility and is currently unused
   * at runtime. It may be removed in a future major version once all
   * consumers stop passing it.
   */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Whether the popover is open */
  open: boolean;
  /**
   * Optional change handler. When supplied, Radix will invoke it on
   * controlled close gestures (Escape, outside click) — but AICADS Popover
   * suppresses those gestures by default so consumers (Dropdown,
   * Autocomplete) can keep their existing behaviour layer in `behaviors/`.
   * Set `inheritDismissBehavior` to `true` to opt back into Radix dismissal.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * When `true`, lets Radix handle Escape and outside-click dismissal and
   * propagate them via `onOpenChange`. Default: `false` (AICADS legacy
   * behaviour — dismissal is controlled by the consumer).
   */
  inheritDismissBehavior?: boolean;
  children: React.ReactNode;
  className?: string;
  /** Maximum height of the popover. Accepts CSS value. Default: '320px'. */
  maxHeight?: string;
  /**
   * Inner panel padding. Must be set explicitly because Radix Portal content
   * does not inherit CSS custom properties from the anchor/trigger element.
   * Default: `var(--space-inset-s)`.
   */
  contentPadding?: string;
  /** When true the popover flips above the anchor if space below is insufficient */
  autoFlip?: boolean;
  style?: React.CSSProperties;
  /** Marks the listbox as supporting multiple selection */
  'aria-multiselectable'?: boolean;
  /** Accessible label for the listbox */
  'aria-label'?: string;
  /** ID attribute */
  id?: string;
}
