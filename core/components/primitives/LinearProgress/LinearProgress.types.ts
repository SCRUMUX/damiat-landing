import React from 'react';

/**
 * @UI/LinearProgress
 * Линейный прогресс-бар с pill-скруглением.
 * 3 размера: sm (4px), md (6px), lg (8px).
 * value — число от 0 до 100 (в Figma приведены примеры 25/50/75).
 */

export type LinearProgressSize = 'sm' | 'md' | 'lg';

export interface LinearProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: LinearProgressSize;
  /** Progress value 0–100 */
  value?: number;
  /** ARIA label for accessibility */
  label?: string;
}
