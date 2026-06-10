import React from 'react';

/**
 * @UI/CircularProgress
 * Круговой индикатор прогресса.
 * 5 размеров: xs(16px), sm(24px), md(32px), lg(40px), xl(48px).
 * Текст процентов внутри отображается только от md и выше.
 * value — число от 0 до 100 (в Figma приведены примеры 25/50/75).
 */

export type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CircularProgressProps extends React.SVGAttributes<SVGSVGElement> {
  size?: CircularProgressSize;
  /** Progress value from 0 to 100 */
  value?: number;
  /** Show percentage label inside (default: true for md/lg/xl, false for xs/sm) */
  showLabel?: boolean;
}
