import React from 'react';

/** Side panel overlay. Slides from left/right. Sizes sm (320px), md (480px), lg (640px). */

export type DrawerSize = 'sm' | 'md' | 'lg';
export type DrawerSide = 'left' | 'right';

export interface DrawerProps {
  /** Whether the drawer is open */
  open?: boolean;
  /** Called when the drawer closes (overlay, escape, close button) */
  onClose?: () => void;
  /** Optional Radix-style open change handler */
  onOpenChange?: (open: boolean) => void;
  size?: DrawerSize;
  side?: DrawerSide;
  title?: React.ReactNode;
  /** Panel body. Falls back to `children` when omitted. */
  content?: React.ReactNode;
  showClose?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
