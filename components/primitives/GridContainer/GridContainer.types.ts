import React from 'react';

export type GridContainerMaxWidth = 'mobile' | 'tablet' | 'desktop' | 'full';

export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Clamp content to a max-width preset. Default: 'desktop' (1440px). */
  maxWidth?: GridContainerMaxWidth;
  /** Center the grid horizontally */
  centered?: boolean;
  /** Override number of columns per breakpoint (defaults to 4/8/12) */
  columns?: { mobile?: number; tablet?: number; desktop?: number };
  /** Render as a specific HTML element (default: div) */
  as?: React.ElementType;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns to span per breakpoint. Number = all breakpoints. */
  span?: number | { mobile?: number; tablet?: number; desktop?: number };
  /** Column start position per breakpoint */
  start?: number | { mobile?: number; tablet?: number; desktop?: number };
  /** Render as a specific HTML element (default: div) */
  as?: React.ElementType;
}
