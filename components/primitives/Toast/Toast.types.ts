import React from 'react';

export type ToastAppearance = 'info' | 'success' | 'warning' | 'danger';

export type ToastPosition =
  | 'top-right'
  | 'top-center'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

/**
 * Shape of a single toast payload as accepted by the imperative `toast()` API.
 *
 * NOTE: AICADS no longer ships a presentational `<Toast>` component. The
 * single visual standard is the sonner-backed `<Toaster>` host plus the
 * imperative `toast()` function. See docs/migrations/v0.4-to-v0.5.md.
 */
export interface ToastItem {
  /** Unique id (set by the toast engine; not required from callers). */
  id?: string;
  /** Visual variant — drives surface and icon colour. */
  appearance?: ToastAppearance;
  /** Title text. */
  title?: React.ReactNode;
  /** Description / body text. */
  description?: React.ReactNode;
  /** Leading icon slot. */
  icon?: React.ReactNode;
  /** Whether the close button is shown. Default true. */
  showClose?: boolean;
  /** Auto-dismiss duration in ms. 0 = sticky. Default 5000. */
  duration?: number;
}

export interface ToasterProps {
  /** Position of the toast stack on screen. */
  position?: ToastPosition;
  /** Maximum number of visible toasts. Default 5. */
  maxVisible?: number;
}
